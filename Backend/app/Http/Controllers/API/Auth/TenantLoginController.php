<?php

namespace App\Http\Controllers\API\Auth;

use App\Custom\ConfigDBUser;
use App\Http\Controllers\Admin\FaqController;
use App\Http\Controllers\Controller;
use App\Mail\SendSmtpMail;
use App\Models\Admin;
use App\Models\all_plan;
use App\Models\db_connection_list;
use App\Models\Tenant;
use App\Models\tenant_db_name;
use App\Models\User;
use App\Models\user_plan;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\App;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\Session;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;
use Laravel\Passport\ClientRepository;
use Stancl\Tenancy\Exceptions\TenantCouldNotBeIdentifiedById;
use Stripe\Customer;
use Stripe\Stripe;

class TenantLoginController extends Controller
{

    private $db_con;

    public function __construct ()
    {
        $custom_db_config = new ConfigDBUser();
        $this->db_con = $custom_db_config;
    }

    public function tenant_register_submit(Request $request)
    {
        $validator      = Validator::make($request->all(), [
            'name'      => 'required',
            'email'     => 'required|email',
            'password'  => 'required|min:6',
        ]);

        if ($validator->fails())
        {
            return response()->json([
                'error' => $validator->errors()
            ], 422);
        }

        DB::beginTransaction();
        try {
            $check_email_exist = tenant_db_name::where('tenant_email', $request->email)->first();

            if ($check_email_exist)
            {
                return response()->json([
                    'error' => "Email already exists",
                ],403);
            }
            $name = $request->name . time();//        $lower = strtolower($request->name);
            $lower = strtolower($name);
            $space = str_replace(' ', '', $lower);
            $domain = $space . '.localhost';
            $db_connection = db_connection_list::where('is_use', 0)->where('id', 1)->orderBy('id', 'asc')->first();
            $db_connection_data = $this->db_con->register_db_config($db_connection);
            $tenant = Tenant::create([
                'id' => $space,
            ]);

            $tenant->domains()->create(['domain' => $domain]);
            Stripe::setApiKey(env('STRIPE_SECRET_KEY'));
            $customer = Customer::create([
                'name' => $request->name, // Name of the customer
                'email' => $request->email, // Email of the customer
                'metadata' => $request->all(),
            ]);

            $tenant_db_data = new tenant_db_name();
            $tenant_db_data->tenant_id = $tenant->id;
            $tenant_db_data->tenant_db = $tenant->tenancy_db_name;
            $tenant_db_data->db_con_use = $db_connection_data;
            $tenant_db_data->tenant_email = $request->email;
            $tenant_db_data->stripe_customer_id = $customer->id;
            $tenant_db_data->save();

            tenancy()->initialize($tenant);
            $create_user = User::create([
                'name' => $request->name,
                'email' => $request->email,
                'phone_number' => $request->phone_number,
                'password' => Hash::make($request->password),
                'tenant_id' => $tenant->id,
                'domain_name' => $domain,
                'credit' => 0,
                'strip_cus_id' => $customer->id,
            ]);

            $plan = user_plan::create([
                'user_id' => $create_user->id,
                'plan_id' => -1,
                'exp_date' =>Carbon::now()->addMonths(1),
                'purchase_date' => date('Y-m-d H:i:s'),
                'plan_amount'   => 0,
                'email_account' => 50,
                'plan_type'   => 1,
                'plan_credit' => 0,
                'plan_number_email' => 100000,
                'plan_number_users' => 15000,
                'custom_credit'  => 250,
                'used_credit'  => 0,
                'stripe_subscription_id' =>0,
                'status' => 1,
            ]);

            $check_con = DB::table('oauth_clients')->count();
            if ($check_con <= 0) {
                $clientRepository = new ClientRepository();
                $clientRepository->createPasswordGrantClient(null, $tenant_db_data->tenant_id, '');
                $clientRepository->createPersonalAccessClient(null, $tenant_db_data->tenant_id, '');
            }
            $attribute      = [
                'to'        => base64_encode($request->email),
                'name'      => $request->name,
                'subject'   => 'Welcome to Growtoro',
                'view'      => 'emails.welcome',
            ];

            Mail::to($request->email)->send(new SendSmtpMail($attribute));

            $new_attribute  = [
                'to'        => $request->email,
                'name'      => $request->name,
                'subject'   => 'New User Sign Up',
                'view'      => 'emails.sign_up_notify',
            ];
            Mail::to('sales@growtoro.com')->send(new SendSmtpMail($new_attribute));

            DB::commit();
            return response()->json([
                'status' => 'success',
                'message' => 'Tenant successfully registered',
                'tenant_id' => $tenant->id,
                'domain_name' => $domain,

            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'error' => 'Something Went Wrong'
            ],403);
        }
    }


    public function tenant_login_submit(Request $request): \Illuminate\Http\JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email',
            'password' => 'required',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'error' => $validator->errors()
            ], 422);
        }

        $db_count = tenant_db_name::where('tenant_email', $request->email)->first();
        if (!$db_count)
        {
            return response()->json([
                'error' => "User Not Found",
            ],403);
        }

        if ($db_count->status != 1)
        {
            return response()->json([
                'error' => "Your Account has been disabled",
            ],403);
        }

        $tenant = Tenant::where('id', $db_count->tenant_id)->first();
        $this->db_con->config_db_users($request);

        $credentials = request(['email', 'password']);
        if (Auth::guard('web')->attempt($credentials)) {
            $login_user = Auth::guard('web')->user();
            $user = User::where('id', $login_user->id)->first();
            $success['token'] = $user->createToken($db_count->id)->accessToken;
            $user_details = User::where('id', $user->id)->first();

            if (!$user_details->email_verified_at)
            {
                return response()->json([
                    'error'     => 'Please Verify Your Mail First'
                ], 403);
            }
            $name_first_letter = substr($user->name,0,1);

            $user_details['profile_image'] = $user->profile_image && file_exists($user->profile_image) ? asset($user->profile_image) : "https://ui-avatars.com/api?name=$name_first_letter&color=7F9CF5&background=EBF4FF";

            $connection = $this->db_con->config_set_db($tenant->tenancy_db_name, $db_count->db_con_use, $db_count->tenant_id);

            return response()->json([
                'status' => 'success',
                'message' => 'login successful',
                'access_token' => 'Bearer' . ' ' . $success['token'],
                'token_type' => 'Bearer',
                'user' => $user_details,
                'tenant_id' => $user_details->tenant_id,
                'connection' => $connection,
            ]);
        } else {
            return response()->json([
                'error'     => 'Invalid credentials'
            ], 403);
        }
    }

    protected function createNewProduct(){

        $plan = new all_plan();
        $plan->plan_name = 'Trial Plan';
        $plan->plan_amount = 0;
        $plan->email_account     = 10;
        $plan->plan_number_users = 5000;
        $plan->plan_number_email = 25000;
        $plan->plan_credit       = 250;
        $plan->plan_status = 0;//Active
        $plan->plan_type = 1;
        $plan->save();
        return $plan;
    }

    public function verifyAccount(Request $request): \Illuminate\Http\JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required',
        ]);

        if ($validator->fails())
        {
            return response()->json([
                'status' => 'error',
                'error' => $validator->errors()
            ], 422);
        }

        try {
            $email = base64_decode($request->email);
            $db_count = tenant_db_name::where('tenant_email', $email)->first();
            if (!$db_count) {
                return response()->json([
                    'error' => "User Not Found",
                ],403);
            }
            $tenant = Tenant::where('id', $db_count->tenant_id)->first();
            Config::set('tenancy.database.template_tenant_connection', $db_count->db_con_use);
            DB::purge('tenant');
            Config::set('database.connections.tenant.host', env('DB_HOST'));
            Config::set('database.connections.tenant.username', env('DB_USERNAME'));
            Config::set('database.connections.tenant.password', env('DB_PASSWORD'));
            Config::set('database.connections.tenant.database', $tenant->tenancy_db_name);
            Config::set('database.default', 'tenant');
            DB::reconnect('tenant');

            $this->db_con->config_db_users($request);
            $user_details = User::where('email', $email)->first();
            if (!$user_details->email_verified_at)
            {
                $user_details->email_verified_at = now();
            }
            $user_details->save();
            Auth::guard('web')->login($user_details);
            $login_user = Auth::guard('web')->user();
            $user = User::where('id', $login_user->id)->first();
            $success['token'] = $user->createToken($db_count->id)->accessToken;
            $connection = $this->db_con->config_set_db($tenant->tenancy_db_name, $db_count->db_con_use, $db_count->tenant_id);
            $name_first_letter = substr($user->name,0,1);

            $user_details['profile_image'] = $user->profile_image && file_exists($user->profile_image) ? asset($user->profile_image) : "https://ui-avatars.com/api?name=$name_first_letter&color=7F9CF5&background=EBF4FF";
            return response()->json([
                'status' => 'success',
                'message' => 'login successful',
                'access_token' => 'Bearer' . ' ' . $success['token'],
                'token_type' => 'Bearer',
                'user' => $user_details,
                'tenant_id' => $user_details->tenant_id,
                'connection' => $connection,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'error' => $e
            ],403);
        }
    }

    public function forgotPassword(Request $request): \Illuminate\Http\JsonResponse
    {
        $validator      = Validator::make($request->all(), [
            'email'     => 'required|email',
        ]);

        if ($validator->fails())
        {
            return response()->json([
                'error' => $validator->errors()
            ], 422);
        }

        $db_count = tenant_db_name::where('tenant_email', $request->email)->first();
        if (!$db_count)
        {
            return response()->json([
                'error' => "User Not Found",
            ],403);
        }
        DB::beginTransaction();
        try {

            $this->db_con->config_db_users($request);
            $token = Str::uuid();

            DB::table('password_resets')->where('email',$request->email)->delete();

            DB::table('password_resets')->insert([
                'email' => $request->email,
                'token' => $token,
                'created_at' => now()
            ]);
            $attribute = [
                'to' => $request->email,
                'subject' => 'Forgot Password',
                'token' => $token,
                'view' => 'emails.forget_password',
            ];
            Mail::to($request->email)->send(new SendSmtpMail($attribute));
            DB::commit();
            return response()->json([
                'message' => 'Check your mail for reset password link'
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'error' => $e,
            ],403);
        }
    }

    public function resetPassword(Request $request): \Illuminate\Http\JsonResponse
    {
        $validator      = Validator::make($request->all(), [
            'email'     => 'required|email',
            'token'     => 'required',
            'password'  => 'required|confirmed|min:6',
        ]);

        if ($validator->fails())
        {
            return response()->json([
                'error' => $validator->errors()
            ], 422);
        }
        DB::beginTransaction();
        try {
            $db_count = tenant_db_name::where('tenant_email', $request->email)->first();
            if (!$db_count) {
                return response()->json([
                    'error' => "User Not Found",
                ],403);
            }

            $this->db_con->config_db_users($request);
            $reset = DB::table('password_resets')->where('email', $request->email)->where('token', $request->token)->first();
            if (!$reset) {
                return response()->json([
                    'error' => "Couldn't find the reset link, request another one",
                ]);
            }
            DB::table('password_resets')->where('email', $request->email)->delete();
            $user = User::where('email', $request->email)->first();
            $user->password = bcrypt($request->password);
            $user->save();
            DB::commit();
            return response()->json([
                'message' => "Password Successfully Changed",
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'error' => "Something Went Wrong",
            ],403);
        }
    }
}
