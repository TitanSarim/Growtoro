<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Models\all_plan;
use App\Models\Tenant;
use App\Models\tenant_db_name;
use App\Models\user_plan;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\DB;

class UserPlanController extends Controller
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

    public function plan_list()
    {
        $user_plan_count = user_plan::where('user_id', Auth::user()->id)->count();
        $plans = all_plan::active()->subscriptionPlan()->orderBy('id', 'desc')->paginate(20);
        return view('user.subscription.planList', compact('plans', 'user_plan_count'));
    }

    public function plan_choose($id)
    {
        $plan = all_plan::where('id', $id)->first();
        return view('user.subscription.planChoose', compact('plan'));
    }

    public function my_plan()
    {
        $plan = user_plan::where('user_id', Auth::user()->id)->with('plan')->first();

        if ($plan) {
            $all_plans = all_plan::where('id', '!=', $plan->plan_id)->get();
        } else {
            $all_plans = all_plan::all();
        }

        return view('user.subscription.myPlan', compact('plan', 'all_plans'));
    }

    public function my_plan_change(Request $request)
    {
        return redirect(route('user.payment.stripe', ['id' => $request->user_plan_id, 'type' => 1]));
    }

    public function credit_plan()
    {
        $plans = all_plan::active()->creditPlan()->orderBy('id', 'desc')->paginate(20);
        return view('user.credit.planList', compact('plans'));
    }


    public function credit_plan_save(Request $request)
    {
        $plan = all_plan::where('id', $request->user_plan_id)->first();
        return redirect(route('user.payment.stripe', ['id' => $plan->id, 'type' => 2]));
    }
}
