<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Models\Tenant;
use App\Models\tenant_db_name;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\DB;

class UserEmailController extends Controller
{

    public function __construct(Request $request)
    {
        $host = $request->getHost();
        $host_id = explode('.', trim($host))[0];
        $tenant = Tenant::where('id', $host_id)->first();
        $db_count = tenant_db_name::where('tenant_id', $host_id)->first();

        Config::set('tenancy.database.template_tenant_connection', $db_count->db_con_use);

        DB::purge('tenant');
        Config::set('database.connections.tenant.host', env('DB_HOST'));
        Config::set('database.connections.tenant.username', 'root');
        Config::set('database.connections.tenant.password', '');
        Config::set('database.connections.tenant.database', $tenant->tenancy_db_name);
        DB::reconnect('tenant');
    }

    public function email_download()
    {
        return view('user.email.downloadEmail');
    }

    public function email_download_save($id)
    {
        if (Auth::user()->credit <= 0 || Auth::user()->credit == null) {
            return back()->with('alert', 'Insufficient Credit');
            exit();
        }

        $user = User::where('id', Auth::user()->id)->first();
        $user->credit = $user->credit - 1;
        $user->save();

        return back()->with('success', 'Email Download Successful');

    }
}
