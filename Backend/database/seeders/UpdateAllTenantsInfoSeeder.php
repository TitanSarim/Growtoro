<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Custom\ConfigDBUser;
use App\Models\Tenant;
use App\Models\tenant_db_name;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use App\Models\User;
use App\Models\user_plan;
use App\Models\all_plan;



class UpdateAllTenantsInfoSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        Tenant::all()->each(function ($tenant) {
			$this->check_db($tenant);
		});
		exit();
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

			$this->updateUserPlan($tenant->id);


           // Log::info(Config::get('database.connections.tenant.database'));
		}
	}

	private function updateUserPlan($tenet_id){

		$user_plan = user_plan::first();

		if(!empty($user_plan->plan_id)){

			//check if the plan is exists in the table if not exists than update it to trial subscription
            $plan = all_plan::where('id',$user_plan->plan_id)->first();
            if(empty($plan)){
				$this->updatePlan($user_plan);
            }
		}
		else {

			$this->updatePlan($user_plan);
            // Log::info($plan);
		}

	}

	private function updatePlan($user_plan){

		$plan = all_plan::where('plan_amount',0)->first();

		if(empty($plan)){

			$plan = new all_plan();
	        $plan->plan_name = 'Trial Plan';
	        $plan->plan_amount = 0;
	        $plan->email_account     = config('settings.connected_email_accounts');
	        $plan->plan_number_users = config('settings.uploaded_contacts');
	        $plan->plan_number_email = config('settings.sent_emails');
	        $plan->plan_credit       = config('settings.custom_lead_credits');
	        $plan->plan_status = 0;//Active
	        $plan->plan_type = 1;
	        $plan->save();
		}
		$updateUserPlan = [
            'plan_id' =>$plan->id ,
            // 'exp_date' =>Carbon::now()->addMonths(1),
            // 'purchase_date' => date('Y-m-d H:i:s'),
            'email_account' => $plan->email_account,
            'plan_type'   => $plan->plan_type,
            'plan_credit' => $plan->plan_credit,
            'plan_number_email' =>$plan->plan_number_email,
            'plan_number_users' => $plan->plan_number_users,
            'custom_credit'  => $plan->custom_credit,
        ];

        $user_plan->update($updateUserPlan);
	}
}
