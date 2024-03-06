<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Jobs\EmailDownload;
use App\Models\Tenant;
use App\Models\tenant_db_name;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\DB;

class UserController extends Controller
{

    public function __construct(Request $request)
    {
        $host = $request->getHost();
        $host_id = explode('.', trim($host))[0];
        $tenant = Tenant::where('id', $host_id)->first();
        $db_count = tenant_db_name::where('tenant_id', $host_id)->first();


        DB::disconnect('tenant');
        DB::purge('tenant');


        Config::set('database.default', $tenant->tenancy_db_name);
        Config::set('tenancy.database.template_tenant_connection', $db_count->db_con_use);
        Config::set('queue.connections.database.connection', 'tenant');

        Config::set('database.connections.tenant.host', env('DB_HOST'));
        Config::set('database.connections.tenant.username', 'root');
        Config::set('database.connections.tenant.password', '');
        Config::set('database.connections.tenant.database', $tenant->tenancy_db_name);
        Config::set('database.default', $tenant->tenancy_db_name);
        DB::reconnect('tenant');


        Config::set('tenancy.database.template_tenant_connection', $db_count->db_con_use);
        Config::set('database.connections.tenant.database', $db_count->db_con_use);


        Config::set('database.connections.queue.host', env('DB_HOST'));
        Config::set('database.connections.queue.username', 'root');
        Config::set('database.connections.queue.password', '');
        Config::set('database.connections.queue.database', $tenant->tenancy_db_name);

        DB::purge('tenant');

        DB::reconnect('tenant');


    }

    public function index(Request $request)
    {
        $host = $request->getHost();
        $host_id = explode('.', trim($host))[0];
        $tenant = Tenant::where('id', $host_id)->first();
//        Artisan::call('queue:work', ['--stop-when-empty' => true, '--timeout' => 30, '--tries' => 1]);
//        dispatch(new EmailDownload($tenant, $host_id));
        return view('user.index');
    }


    public function change_password()
    {
        return view('user.page.changePassword');
    }

    public function change_password_save(Request $request)
    {
        if ($request->password != $request->confirm_password) {
            return back()->with('alert', 'Password Not Match');
            exit();
        }

        $user = User::where('id', Auth::user()->id)->first();
        $user->password = Hash::make($request->password);
        $user->save();
        return back()->with('success', 'Password Successfully Changed');
    }
}
