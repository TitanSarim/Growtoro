<?php

namespace App\Console\Commands;

use App\Custom\ConfigDBUser;
use App\Models\Tenant;
use App\Models\tenant_db_name;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class UserDBMigrate extends Command
{
	/**
	 * The name and signature of the console command.
	 *
	 * @var string
	 */
	protected $signature = 'userdb:migrate';

	/**
	 * The console command description.
	 *
	 * @var string
	 */
	protected $description = 'Command description';

	/**
	 * Execute the console command.
	 *
	 * @return int
	 */
	public function handle ()
	{
		Tenant::all()->each(function ($tenant) {
			$this->check_db($tenant);
		});
		exit();
//        return Command::SUCCESS;
	}


	private function check_db ($tenant)
	{
		$db_count = tenant_db_name::where('tenant_id', $tenant->id)->first();
		if ($db_count) {
			Config::set('tenancy.database.template_tenant_connection', $db_count->db_con_use);
			DB::purge('tenant');
			Config::set('database.connections.tenant.host', env('DB_HOST'));
			Config::set('database.connections.tenant.username', env('DB_USERNAME'));
			Config::set('database.connections.tenant.password', env('DB_PASSWORD'));
			Config::set('database.connections.tenant.database', $tenant->tenancy_db_name);
			Config::set('database.default', 'tenant');
			DB::reconnect('tenant');

			Artisan::call("migrate", [
				'--database' => 'tenant',
				// '--path' => 'database/migrations/tenant/2023_04_18_211718_create_user_billings_table.php',
				'--path' => 'database/migrations/tenant/2023_12_27_070204_add_attachment_columm_in_drip_replies.php',
				'--force' => true,
			]);
//            Log::info(Config::get('database.connections.tenant.database'));
		}
	}
}
