<?php

namespace App\Http\Middleware;

use App\Models\Tenant;
use App\Models\tenant_db_name;
use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\DB;

class UserConfDb
{
    /**
     * Handle an incoming request.
     *
     * @param \Illuminate\Http\Request $request
     * @param \Closure(\Illuminate\Http\Request): (\Illuminate\Http\Response|\Illuminate\Http\RedirectResponse) $next
     * @return \Illuminate\Http\Response|\Illuminate\Http\RedirectResponse
     */
    public function handle(Request $request, Closure $next)
    {
//        $host = $request->getHost();
//        $host_id = explode('.', trim($host))[0];
//        $tenant = Tenant::where('id', $host_id)->first();
//        if (!$tenant) {
//            return 'Not Found User';
//            exit();
//        }
//        $db_count = tenant_db_name::where('tenant_id', $host_id)->first();
//
//        Config::set('tenancy.database.template_tenant_connection', $db_count->db_con_use);
//        Config::set('database.connections.tenant.host', '127.0.0.1');
//        Config::set('database.connections.tenant.username', 'root');
//        Config::set('database.connections.tenant.password', '');
//        Config::set('database.connections.tenant.database', $tenant->tenancy_db_name);
//        DB::reconnect('tenant');
        return $next($request);
    }
}
