<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Jobs\EmailDownload;
use App\Models\Tenant;
use App\Models\tenant_db_name;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class CustomLoginController extends Controller
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


    public function custom_register(Request $request)
    {
        $name = $request->name;
        $lower = strtolower($request->name);
        $space = str_replace(' ', '', $lower);
        $domain = $space . '.localhost';

        $tenant = Tenant::create(['id' => $space]);
        $tenant->domains()->create(['domain' => $domain]);

        tenancy()->initialize($tenant);

        $create_user = User::create([
            'name' => $space,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'tenant_id' => $tenant->id,
            'domain_name' => $domain,
        ]);

        return back();
    }


    public function custom_login(Request $request)
    {

        $host = $request->getHost();
        $host_id = explode('.', trim($host))[0];

        $this->validate($request, [
            'email' => 'required',
            'password' => 'required|min:8',
        ]);

        $tenant = Tenant::where('id', $host_id)->first();


        if (Auth::guard('web')->attempt(['email' => $request->email, 'password' => $request->password], $request->remember)) {
            return redirect(route('user.dashboard'));
        } else {
            return back()->with('login_error', 'Invalid Credentials');
        }
    }
}
