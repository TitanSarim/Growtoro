<?php

namespace App\Repositories;

use App\Models\Tenant;
use App\Models\tenant_db_name;
use App\Models\User;
use App\Models\user_plan;
use App\Repositories\Interfaces\AdminUsersInterface;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\DB;

class AdminUserRepository implements AdminUsersInterface
{


    public $all_users = [];
    public $user_plan = [];
    public $user_credit_plan = [];

    public function init_user_db()
    {
//        $all_ten = Tenant::all();
//
//        foreach ($all_ten as $ten) {
//            $tenant = Tenant::where('id', $ten->id)->first();
//            $db_count = tenant_db_name::where('tenant_id', $tenant->id)->first();
//
//
//            Config::set('tenancy.database.template_tenant_connection', $db_count->db_con_use);
//
//            DB::purge('tenant');
//            Config::set('database.connections.tenant.host', '127.0.0.1');
//            Config::set('database.connections.tenant.username', 'root');
//            Config::set('database.connections.tenant.password', '');
//            Config::set('database.connections.tenant.database', $tenant->tenancy_db_name);
//            DB::reconnect('tenant');
//        }
    }


    public function get_all_users()
    {
        tenancy()->runForMultiple(null, function (Tenant $tenant) {
            $users = User::all();
            foreach ($users as $usr) {
                array_push($this->all_users, [
                    'id' => $usr->id,
                    'name' => $usr->name ?? '',
                    'email' => $usr->email ?? '',
                    'tenant_id' => $usr->tenant_id ?? '',
                    'created_date' => $usr->created_date,
                ]);
            }
        });

        return $this->all_users;
    }


    public function get_user_plan()
    {


        tenancy()->runForMultiple(null, function (Tenant $tenant) {
            $plans = user_plan::subscriptionPlan()->with(['user', 'plan'])->get();
            foreach ($plans as $usr) {
                array_push($this->user_plan, [
                    'id' => $usr->id,
                    'name' => $usr->user->name ?? '',
                    'email' => $usr->user->email ?? '',
                    'plan_name' => $usr->plan->plan_name ?? '',
                    'plan_amount' => $usr->plan->plan_amount ?? 0.00,
                    'plan_type' => $usr->plan->plan_type ?? '',
                    'status' => $usr->status ?? '',
                    'purchase_date' => $usr->purchase_date ?? '',
                    'tenant_id' => $usr->user->tenant_id ?? '',
                    'created_date' => $usr->created_date,
                ]);
            }
        });

        return $this->user_plan;


    }


    public function get_user_credit_plan()
    {
        tenancy()->runForMultiple(null, function (Tenant $tenant) {
            $plans = user_plan::creditPlan()->with(['user', 'plan'])->get();
            foreach ($plans as $usr) {
                array_push($this->user_credit_plan, [
                    'id' => $usr->id,
                    'name' => $usr->user->name ?? '',
                    'email' => $usr->user->email ?? '',
                    'plan_name' => $usr->plan->plan_name ?? '',
                    'plan_amount' => $usr->plan->plan_amount ?? 0.00,
                    'plan_type' => $usr->plan->plan_type ?? '',
                    'plan_credit' => $usr->plan->plan_credit ?? '',
                    'status' => $usr->status ?? '',
                    'purchase_date' => $usr->purchase_date ?? '',
                    'tenant_id' => $usr->user->tenant_id ?? '',
                    'created_date' => $usr->created_date,
                ]);
            }
        });

        return $this->user_credit_plan;
    }
}
