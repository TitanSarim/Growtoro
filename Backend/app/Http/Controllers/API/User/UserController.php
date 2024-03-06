<?php

namespace App\Http\Controllers\API\User;

use App\Custom\ConfigDBUser;
use App\Http\Resources\AddonResource;
use App\Models\Addon;
use App\Models\DripEmail;
use App\Models\Emails\EmailAccount;
use App\Models\Emails\EmailListSubscriber;
use App\Models\Tenant;
use App\Models\tenant_db_name;
use App\Models\User;
use App\Models\user_plan;
use App\Models\UserAddon;
use App\Models\UserCredit;
use Illuminate\Http\Request;
use App\Models\Emails\DripReply;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;
use Intervention\Image\Facades\Image;

class UserController extends Controller
{

    private $db_con;

    public function __construct ()
    {
        $custom_db_config = new ConfigDBUser();
        $this->db_con = $custom_db_config;
    }

    public function my_profile()
    {
        $profile = User::where('id',Auth::user()->id)->first();

        return response()->json([
            'status' => 'success',
            'message' => 'get my profile',
            'profile'=>$profile
        ]);

    }


    public function change_password_save(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'password' => 'required|min:8',
            'confirm_password' => 'required|min:8',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'msg' => $validator->errors()
            ], 400);
        }


        if ($request->password != $request->confirm_password) {
            return response()->json([
                'status' => 'error',
                'message' => 'Password Not Match'
            ]);
        }

        $user = User::where('id', Auth::user()->id)->first();
        $user->password = Hash::make($request->password);
        $user->save();
    }


    public function user_db_migrations(Request $request)
    {
        Artisan::call('migrate');

        return 'migrate';
    }

    // updateProfile

    public function updateProfile(Request $request): \Illuminate\Http\JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required',
            'time_zone' => 'required',
            'profile_image' => 'nullable',
        ]);
        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'error' => $validator->errors()
            ], 422);
        }
        try {
            $user = User::where('id', Auth::user()->id)->first();
            $user->name = $request->name;
            $user->time_zone = $request->time_zone;

            if ($request->has('password') && $request->password != null) {
                if ($request->password == $request->confirm_password) {
                    $user->password = Hash::make($request->password);
                } else {
                    return response()->json([
                        'status' => 'error',
                        'error' => 'Password Not Match'
                    ], 422);
                }
            }

            if ($request->file && $request->has('file') && $request->file != 'null') {
                $image = $request->file;
                $image_name = Str::uuid() . '.' . $image->getClientOriginalExtension();
                $path = 'images/profile/';
                Image::make($image)->resize(null,50, function ($constraint) {
                    $constraint->aspectRatio();
                })->save($path . $image_name);
                $user->profile_image = $path.$image_name;
            }
            $user->save();
            $name_first_letter = substr($user->name,0,1);
            $user['profile_image'] = $user->profile_image && file_exists($user->profile_image) ? asset($user->profile_image) : "https://ui-avatars.com/api?name=$name_first_letter&color=7F9CF5&background=EBF4FF";

            $db_count = tenant_db_name::where('tenant_email', $user->email)->first();
            $tenant = Tenant::where('id', $db_count->tenant_id)->first();
            $this->db_con->config_db_users($request);
            $success['token'] = $user->createToken($db_count->id)->accessToken;
            $connection = $this->db_con->config_set_db($tenant->tenancy_db_name, $db_count->db_con_use, $db_count->tenant_id);

            return response()->json([
                'status'    => 'success',
                'user'      => $user,
                'message'   => 'Profile Updated Successfully',
                'access_token' => 'Bearer' . ' ' . $success['token'],
                'token_type' => 'Bearer',
                'tenant_id' => $user->tenant_id,
                'connection' => $connection,
            ],200);

        } catch (\Exception $e) {
            return response()->json([
                'error' => $e->getMessage()
            ], 403);
        }
    }
    public function usage(): \Illuminate\Http\JsonResponse
    {
        try {
            $total_credits      = UserCredit::sum('credits');
            $max_sent_emails    = 100000;
            $max_contacts       = 15000;
            $connected_emails   = 50;
            $subscription       = user_plan::where('user_id', auth()->id())->where('status', 1)->first();

            // if ($subscription && $subscription->plan)
            if ($subscription)
            {
                $max_sent_emails    = 0;
                $max_contacts       = 0;
                $total_credits      += $subscription->plan_credit;
                $max_sent_emails    += $subscription->plan_number_email;
                $max_contacts       += $subscription->plan_number_users;
                $connected_emails    = $subscription->email_account;
            }

            $addon = UserAddon::where('status',1)->first();

            if ($addon)
            {
                if (!$subscription || !$subscription->plan)
                {
                    $max_sent_emails    = 0;
                }
                $max_sent_emails    += $addon->emails;
                $total_credits      += $addon->credits;
            }

            $total_email_account = EmailAccount::count();

            if ($connected_emails < 1)
            {
                $msg = "$total_email_account/Unlimited";
            }
            else{
                $msg = "$total_email_account/$connected_emails";
            }

            $data                   = [
                'uploaded_contacts' => number_format(EmailListSubscriber::distinct('email')->count()),
                'sent_emails'       => number_format(DripEmail::where('status',1)->count()),
                'active_addon'      => $addon ? $addon->addon_id : null,
                'active_addon_type' => $addon && $addon->addon ? $addon->addon->interval_type : '',
                'max_sent_emails'   => number_format($max_sent_emails),
                'max_contacts'      => number_format($max_contacts),
                'addons'            => AddonResource::collection(Addon::where('interval_type','monthly')->get()),
                'yearly_addons'     => AddonResource::collection(Addon::where('interval_type','yearly')->get()),
                'connected_email'   => $msg,
                'plan_credit'       => number_format($subscription && $subscription->plan ? $subscription->plan_credit : 250),
                'success'           => 'Usage Retrieved Successfully',
            ];
            return response()->json($data);
        } catch (\Exception $e) {
            return response()->json([
                'error' => $e->getMessage()
            ],403);
        }
    }

    public function destroy($tenant_id)
    {
        try{
            Tenant::find($tenant_id)->delete();
            $tenant_db = tenant_db_name::where('tenant_id',$tenant_id)->first();

            $tenant_db_name = $tenant_db->tenant_db;
            $tenant_db->delete();


            DB::statement('DROP DATABASE '.$tenant_db_name);
            return response()->json([
                'message' => 'User deleted successfully',
                'status'  => true,
            ],200);
        }
        catch (\Exception $e){
            return response()->json([
                'message' => 'User deleted successfully',
                'status'  => true,
            ],403);
        }
    }

}
