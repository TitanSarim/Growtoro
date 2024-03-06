<?php

namespace App\Http\Controllers\API\User;

use App\Http\Controllers\Controller;
use App\Models\all_plan;
use App\Models\transaction;
use App\Models\user_billing;
use App\Models\user_plan;
use App\Repositories\APIUserBillingRepository;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class UserBilligController extends Controller
{

	private $user_id;
	private $APIUsrBillRepository;

	public function __construct (APIUserBillingRepository $APIUserBillingRepository)
	{
		$this->user_id = Auth::user()->id;
		$this->APIUsrBillRepository = $APIUserBillingRepository;
	}

	public function save_usage (Request $request)
	{
		$validator = Validator::make($request->all(), [
			'plan_id' => 'required',
			'usage_number' => 'required',
			'type' => 'required',
		], [
			'plan_id.required' => "Please Enter Plan ID",
			'usage_number.required' => "Please Enter Ssage Number",
			'type.required' => "Please Enter type",
		]);

		if ($validator->fails()) {
			return response()->json([
				'status' => 'error',
				'msg' => $validator->errors()
			], 400);
			exit();
		}

		$data = $this->APIUsrBillRepository->save_bill_usage($request, $this->user_id);
		return response()->json([
			"status" => "success",
			"message" => "Billing usage successfully created",
			"data" => $data
		]);

	}
}
