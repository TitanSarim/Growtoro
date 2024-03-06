<?php

namespace App\Http\Middleware;

use App\Models\Tenant;
use App\Models\tenant_db_name;
use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Laravel\Passport\Passport;

class SetAPIUserTokenDB
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

        $tenant_id = $request->tenant_id;
        if ($tenant_id) {
            $db_check = tenant_db_name::where('tenant_id', $tenant_id)->first();
            if ($db_check) {
                Config::set('tenancy.database.template_tenant_connection', $db_check->db_con_use);

                DB::purge('tenant');
                Config::set('database.connections.tenant.host', env('DB_HOST'));
                Config::set('database.connections.tenant.username', env('DB_USERNAME'));
                Config::set('database.connections.tenant.password', env('DB_PASSWORD'));
                Config::set('database.connections.tenant.database', $db_check->tenant_db);
                Config::set('database.default', 'tenant');

                DB::reconnect('tenant');
            }
        }


        return $next($request);
    }
}
