<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Mail\SendSmtpMail;
use App\Models\db_connection_list;
use App\Models\Emails\EmailListSubscriber;
use App\Models\Tenant;
use App\Models\tenant_db_name;
use App\Models\User;
use App\Models\user_order;
use App\Models\user_plan;
use App\Models\UserAddon;
use App\Models\UserCredit;
use App\Repositories\AdminPlanRepository;
use App\Repositories\AdminUserRepository;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;
use Intervention\Image\Facades\Image;
use Laravel\Passport\ClientRepository;


class AdminUserController extends Controller
{

    public $users = [];
    public $users_plan = [];


    private $AdminPlanRepo;
    private $AdminUserRepo;

    public function __construct(AdminPlanRepository $AdminPlanRepository, AdminUserRepository $AdminUserRepository)
    {
        $this->AdminPlanRepo = $AdminPlanRepository;
        $this->AdminUserRepo = $AdminUserRepository;
        $this->AdminUserRepo->init_user_db();
    }

    public function index()
    {
        try {
            $data = [
                'users' => tenant_db_name::latest()->paginate(15)
            ];
            return view('admin.user.index', $data);
        } catch (\Exception $e) {
            return back()->with('danger', 'Something Went Wrong');
        }
    }

    public function create_user()
    {

//        tenancy()->runForMultiple(null, function (Tenant $tenant) {
//            foreach (User::get() as $usr) {
//                array_push($this->users, [
//                    'id' => $usr->id,
//                    'name' => $usr->name,
//                    'email' => $usr->email,
//                    'tenant_id' => $usr->tenant_id,
//                    'created_date' => $usr->created_date,
//                ]);
//            }
//        });
        $all_users = Tenant::paginate(20);
        $db_com = db_connection_list::all();
//        $all_users_ten = $this->users;


        return view('admin.user.createUser', compact('all_users', 'db_com'));
    }

    public function create_user_save(Request $request): \Illuminate\Http\RedirectResponse
    {
        $name = $request->name;
        $lower = strtolower($request->name);
        $space = str_replace(' ', '', $lower);
        $domain = $space . '.localhost';


        $db_connection = db_connection_list::where('is_use', 0)->where('id', 1)->orderBy('id', 'asc')->first();


        if ($db_connection) {
            $db_count = tenant_db_name::where('db_con_use', $db_connection->db_name)->count();
            if ($db_count <= 10) {
                $new_db_name = $db_connection->db_name;
                Config::set('tenancy.database.template_tenant_connection', $db_connection->db_name);
                $get_config = Config::get('tenancy.database.template_tenant_connection');
            } else {
                $new_db_name = env('DB_CONNECTION');
                Config::set('tenancy.database.template_tenant_connection', '');
                $get_config = Config::get('tenancy.database.template_tenant_connection');
            }


        } else {
            $new_db_name = env('DB_CONNECTION');
            Config::set('tenancy.database.template_tenant_connection', '');
            $get_config = Config::get('tenancy.database.template_tenant_connection');
        }


        $tenant = Tenant::create([
            'id' => $space,
        ]);
        $tenant->domains()->create(['domain' => $domain]);

        $tenant_db_data = new tenant_db_name();
        $tenant_db_data->tenant_id = $tenant->id;
        $tenant_db_data->tenant_db = $tenant->tenancy_db_name;
        $tenant_db_data->db_con_use = $new_db_name;
        $tenant_db_data->tenant_email = $request->email;
        $tenant_db_data->save();


        tenancy()->initialize($tenant);

        $create_user = User::create([
            'name' => $space,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'tenant_id' => $tenant->id,
            'domain_name' => $domain,
            'credit' => 0,
        ]);

        $clientRepository = new ClientRepository();

        $client = $clientRepository->createPasswordGrantClient(null, $tenant_db_data->id, '');
        $acc = $clientRepository->createPersonalAccessClient(null, $tenant_db_data->id, '');


        return redirect()->back()->with('success', 'User Successfully Created');
    }

    public function tenants_view($id): \Illuminate\Database\Eloquent\Collection
    {
        $tenant = Tenant::where('id', $id)->first();
        tenancy()->initialize($tenant);
        $users = user_order::all();
        return $users;
    }

    public function getUserInfo($tenant_id)
    {
        try {
            $db_count = tenant_db_name::where('tenant_id', $tenant_id)->first();
            Config::set('tenancy.database.template_tenant_connection', $db_count->db_con_use);
            DB::purge('tenant');
            Config::set('database.connections.tenant.host', env('DB_HOST'));
            Config::set('database.connections.tenant.username', env('DB_USERNAME'));
            Config::set('database.connections.tenant.password', env('DB_PASSWORD'));
            Config::set('database.connections.tenant.database', $db_count->tenant_db);
            Config::set('database.default', 'tenant');
            DB::reconnect('tenant');

            $subscription = user_plan::with('plan')->where('status',1)->first();

            $data                   = [
                'tenant_id'         => $tenant_id,
                'subscription'      => $subscription && $subscription->plan ? $subscription : null,
                'one_time_credit'   => UserCredit::sum('credits'),
                'user'              => User::first(),
            ];
            return view('admin.user.user-info', $data);
        } catch (\Exception $e) {
            return back()->with('danger', 'Something Went Wrong');
        }
    }
    public function planUpdate(Request $request): \Illuminate\Http\RedirectResponse
    {
        $request->validate([
            'plan_credit'   => 'required',
            'custom_credit' => 'required'
        ]);
        try {
            $db_count = tenant_db_name::where('tenant_id', $request->user_tenant_id)->first();
            $table = "$db_count->tenant_db.user_plan";

            DB::table($table)->where('id',$request->id)->update([
                'plan_credit'   => $request->plan_credit,
                'used_credit'   => $request->custom_credit
            ]);

            if ($request->one_time_credit)
            {
                $table = "$db_count->tenant_db.user_credits";

                DB::table($table)->where('status',1)->update([
                    'credits'   => $request->one_time_credit
                ]);
            }

            return back()->with('success', 'Credit Updated Successfully');
        } catch (\Exception $e) {
            return back()->with('error', 'Something Went Wrong');
        }
    }

    public function checkCsv(Request $request): \Illuminate\Http\JsonResponse|\Illuminate\Http\RedirectResponse
    {
        $validator = Validator::make($request->all(),[
            'list_name' => 'required',
            'csv_file'  => 'required'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'error' => $validator->errors()
            ], 422);
        }

        try {
            $line_of_text = [];
            $file_handle = fopen($request->csv_file, 'r');
            while (!feof($file_handle)) {
                $line_of_text[] = fgetcsv($file_handle, 0);
            }
            fclose($file_handle);
            if (count($line_of_text) == 0) {
                return response()->json([
                    'error' => 'No rows found In List'
                ]);
            }

            $common_fields = [
                'First Name',
                'Last Name',
                'Email',
                'Job Title',
                'State',
                'Country',
                'City',
                'Company',
            ];

            $headers        = $line_of_text[0];
            $missing_keys   = array_diff($headers, $common_fields);
            $all_fields     = array_merge($common_fields,$missing_keys);
            $all_fields[]   = 'Custom';

            $data = [
                'common_fields'     => $all_fields,
                'fields'            => $line_of_text,
                'list_name'         => $request->list_name,
                'user_tenant_id'    => $request->user_tenant_id,
            ];
            return response()->json([
                'html'      => view('admin.user.csv-info',$data)->render(),
                'success'   => true
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'error' => $e->getMessage()
            ]);
        }

    }

    public function uploadList(Request $request): \Illuminate\Http\RedirectResponse
    {
        $request->validate([
            'list_name' => 'required',
            'csv_file'  => 'required'
        ]);

        DB::beginTransaction();
        try {
            $line_of_text   = json_decode($request->csv_file);
            $db_count       = tenant_db_name::where('tenant_id', $request->user_tenant_id)->first();
            $table          = "$db_count->tenant_db.email_lists";

            $list_id = DB::table($table)->insertGetId([
                'list_uid'      => Str::uuid(),
                'user_id'       => 1,
                'list_name'     => $request->list_name,
                'created_at'    => now(),
                'updated_at'    => now(),
            ]);

            $table      = "$db_count->tenant_db.email_list_subscribers";

            $rows = [];

            $existing_emails = [];

            $email_key = array_search("email", $request->fields);

            if ($request->status == 1)
            {
                $existing_emails =  DB::table($table)->where('type','Custom Lead Order')->whereIn('email',array_column($line_of_text, $email_key))->pluck('email')->toArray();
            }
            $duplicates = 0;

            $filtered_array = array_filter($line_of_text);
            foreach ($filtered_array as $key=> $row)
            {
                if ($request->status == 1 && in_array($row[$email_key],$existing_emails))
                {
                    $duplicates++;
                }
                else if ($key > 0 && is_array($row))
                {
                    $other_data = array_combine($request->fields, $row);
                    $rows[]                 = [
                        'subscriber_uid'    => Str::uuid(),
                        'list_id'           => $list_id,
                        'email'             => $row[$email_key],
                        'status'            => 1,
                        'other'             => json_encode($other_data),
                        'type'              => 'Custom Lead Order',              
                        'created_at'        => now(),
                        'updated_at'        => now(),
                    ];
                }
            }


            $total_rows = array_chunk($rows,500);

            foreach ($total_rows as $total_row)
            {
                DB::table($table)->insert($total_row);
            }

            DB::commit();

            if ($request->status == 1 && $duplicates > 0)
            {
                $msg ="Found ". $duplicates. " duplicate, ". count($total_rows). " were imported";
            }
            else{
                $msg = 'Leads imported successfully';
            }

            $attribute      = [
                'view'      => 'emails.custom_lead_request',
                'subject'   => 'Your custom lead request has been completed',
                'user'      => DB::table("$db_count->tenant_db.users")->first()
            ];

            Mail::to($db_count->tenant_email)->send(new SendSmtpMail($attribute));

            return back()->with('success',$msg);

        } catch (\Exception $e) {
            DB::rollBack();
            return back()->with('error',$e->getMessage());
        }
    }

    public function userUpdate(Request $request): \Illuminate\Http\RedirectResponse
    {
        $request->validate([
            'name'      => 'required',
            'email'     => 'required',
            'password'  => 'nullable|min:8|confirmed',
        ]);

        try {
            $db_count = tenant_db_name::where('tenant_id', $request->user_tenant_id)->first();
            $table = "$db_count->tenant_db.users";
            $user = DB::table($table)->find(1);
            $password = $user->password;
            $image = $user->profile_image;
            if ($request->password) {
                $password = bcrypt($request->password);
            }
            if ($request->image) {
                $path = 'images/profile/';
                $image_name = Str::uuid() . '.' . $request->image->getClientOriginalExtension();
                Image::make($request->image)->resize(null, 50, function ($constraint) {
                    $constraint->aspectRatio();
                })->save($path . $image_name);
                $image = $path . $image_name;
            }
            if ($request->email)
            {
                $db_count->tenant_email = $request->email;
                $db_count->save();
            }
            DB::table($table)->where('id', 1)->update([
                'name'          => $request->name,
                'email'         => $request->email,
                'password'      => $password,
                'profile_image' => $image,
            ]);
            return back()->with('success', 'Account info Updated Successfully');
        } catch (\Exception $e) {
            return back()->with('error', $e->getMessage());
        }
    }

    public function deleteTenant($tenant_id): \Illuminate\Http\RedirectResponse
    {
        try {
            Tenant::destroy($tenant_id);
            $tenant_db = tenant_db_name::where('tenant_id', $tenant_id)->first();
            $tenant_db_name = $tenant_db->tenant_db;
            DB::statement('DROP DATABASE ' . $tenant_db_name);
            $tenant_db->delete();

            return back()->with('success', 'Account destroyed Successfully');
        } catch (\Exception $e) {
            return back()->with('error', $e->getMessage());
        }
    }

    public function changeTenantStatus($tenant_id): \Illuminate\Http\RedirectResponse
    {
        try {
            $tenant_db          = tenant_db_name::where('tenant_id', $tenant_id)->first();
            $tenant_db->status  = $tenant_db->status == 1 ? 0 : 1;
            $tenant_db->save();

            return back()->with('success', 'Status CHanged Successfully');
        } catch (\Exception $e) {
            return back()->with('error', $e->getMessage());
        }
    }

    public function updateTenantDB()
    {
        try {
            $tenants = tenant_db_name::all();
            foreach ($tenants as $tenant) {
                Config::set('tenancy.database.template_tenant_connection', $tenant->db_con_use);
                DB::purge('tenant');
                Config::set('database.connections.tenant.host', env('DB_HOST'));
                Config::set('database.connections.tenant.username', env('DB_USERNAME'));
                Config::set('database.connections.tenant.password', env('DB_PASSWORD'));
                Config::set('database.connections.tenant.database', $tenant->tenant_db);
                Config::set('database.default', 'tenant');
                DB::reconnect('tenant');
                Artisan::call('migrate', ['--path' => 'database/migrations/tenant','--force' => true]);
            }
            return back()->with('success', 'Database update Successfully');
        } catch (\Exception $e) {
            return back()->with('error', $e->getMessage());
        }
    }
}
