<?php

namespace App\Repositories;

use App\Models\all_plan;
use App\Models\transaction;
use App\Models\User;
use App\Models\user_billing;
use App\Models\user_plan;
use App\Repositories\Interfaces\APIUserBillingInterface;
use Carbon\Carbon;
use Illuminate\Support\Facades\Auth;

class APIUserBillingRepository implements APIUserBillingInterface
{
	public function save_bill_usage ($request, $user_id)
	{
		$check_user_plan = user_plan::where('user_id', $user_id)->first();
		if (!$check_user_plan) {
			return response()->json([
				'status' => 'error',
				'message' => "You don't have any active plan"
			]);
		}
		
		$plan = all_plan::where('id', $check_user_plan->plan_id)->first();
		
		if (!$plan) {
			return response()->json([
				'status' => 'error',
				'message' => "Plan not found"
			]);
		}
		
		$save_bil_data = $this->save_billing_data($request, $user_id, $plan);
		$save_tran_data = $this->save_transaction_data($request, $user_id, $plan, $save_bil_data->id);
		
		$user = User::where('id', $user_id)->first();
		
		if ($request->type == 1) {
			$user->credit = $user->credit + $request->usage_number;
		}
		
		if ($request->type == 2) {
			$user->credit = $user->credit - $request->usage_number;
		}
		
		$user->save();
		
		
		return response()->json([
			'billing' => $save_bil_data,
			'transaction' => $save_tran_data,
		]);
		
	}
	
	public function save_billing_data ($request, $user_id, $plan)
	{
		$new_usage = new user_billing();
		$new_usage->user_id = $user_id;
		$new_usage->plan_id = $plan->id;
		$new_usage->plan_type = $plan->plan_type;
		$new_usage->next_due_date = $plan->plan_type == 1 ? Carbon::now()->addDays($plan->exp_date) : null;
		$new_usage->save();
		
		return $new_usage;
	}
	
	public function save_transaction_data ($request, $user_id, $plan, $bil_id)
	{
		
		$new_tran = new transaction();
		$new_tran->user_id = $user_id;
		$new_tran->billing_id = $bil_id;
		$new_tran->transaction_type = "Credit";
		$new_tran->transaction_date = Carbon::now()->format('Y-m-d H:m:s');
		$new_tran->transaction_amount = $plan->plan_amount;
		$new_tran->transaction_description = "Some desc";
		$new_tran->save();
		
		return $new_tran;
	}
}