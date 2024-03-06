<?php

namespace App\Custom;

use App\Models\Tenant;
use App\Models\tenant_db_name;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\DB;
use Laravel\Passport\ClientRepository;

class ConfigDBUser
{
    public function config_db_users($request)
    {
        $tenant_db_name = tenant_db_name::where('tenant_email', $request->email)->first();
        if (!$tenant_db_name) {
            return response()->json([
                'status' => 'error',
                'message' => "User Not Found",
            ]);
        }

        $tenant = Tenant::where('id', $tenant_db_name->tenant_id)->first();

        if (!$tenant) {
            return response()->json([
                'status' => 'error',
                'message' => "User Not Found",
            ]);
        }

        Config::set('tenancy.database.template_tenant_connection', $tenant_db_name->db_con_use);
        DB::purge('tenant');
        Config::set('database.connections.tenant.host', env('DB_HOST'));
        Config::set('database.connections.tenant.username', env('DB_USERNAME'));
        Config::set('database.connections.tenant.password', env('DB_PASSWORD'));
        Config::set('database.connections.tenant.database', $tenant->tenancy_db_name);
        Config::set('database.default', 'tenant');
        DB::reconnect('tenant');

        $check_con = DB::table('oauth_clients')->count();
        if ($check_con <= 0) {
            $clientRepository = new ClientRepository();
            $clientRepository->createPasswordGrantClient(null, $tenant_db_name->tenant_id, '');
            $clientRepository->createPersonalAccessClient(null, $tenant_db_name->tenant_id, '');
        }

        return 'user_db_configured';
    }


    public function config_set_db($tenancy_db_name, $db_con_use, $tenant_id)
    {
        Config::set('database.connections.tenant.database', $tenancy_db_name);
        Config::set('passport.storage.database.connection', $db_con_use);
        Config::set('passport.storage.database.tenant_id', $tenant_id);
        $connected_db = Config::get('passport.storage.database.connection');

        return $connected_db;
    }


    public function register_db_config($db_connection)
    {
        if ($db_connection) {
            $db_count = tenant_db_name::where('db_con_use', $db_connection->db_name)->count();

            //            if ($db_count <= 10) {
            if ($db_count >= 1 || $db_count == 0) {
                $new_db_name = $db_connection->db_name;
                Config::set('tenancy.database.template_tenant_connection', $db_connection->db_name);
                return $new_db_name;
                exit();
            } else {
                $new_db_name = env('DB_CONNECTION');
                Config::set('tenancy.database.template_tenant_connection', '');
                return $new_db_name;
                exit();
            }
        } else {
            $new_db_name = env('DB_CONNECTION');
            Config::set('tenancy.database.template_tenant_connection', '');
            return $new_db_name;
            exit();
        }
    }
}
