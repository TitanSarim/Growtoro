<?php

namespace App\Http\Controllers\API\User;

use App\Http\Controllers\Controller;
use App\Models\all_plan;
use App\Models\user_order;
use App\Models\user_order_detail;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class UserOrderController extends Controller
{

    public function create_new_order(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'plan_id' => 'required',
            'name' => 'required',
            'email' => 'required',
        ],[
            'plan_id.required' => "Please Enter Plan ID",
            'name.required' => "Please Enter Name",
            'email.required' => "Please Enter email",
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'msg' => $validator->errors()
            ], 400);

            exit();
        }

        $plan = all_plan::where('id',$request->plan_id)->first();

        $user_id = Auth::user()->id;

        $new_order = new user_order();
        $new_order->user_id = $user_id;
        $new_order->order_id = time() . $user_id . rand(0000, 9999);
        $new_order->total_amount = number_format($plan->plan_amount, 2);
        $new_order->name = $request->name;
        $new_order->email = $request->email;
        $new_order->phone = $request->phone;
        $new_order->address = $request->address;
        $new_order->save();

        $this->create_order_details($request, $plan,$new_order->id);

        return response()->json([
            'status' => 'success',
            'message' => 'purchase successfull',
        ]);
    }


    public function create_order_details($request, $plan_id,$order_id)
    {
        $order_detais = new user_order_detail();
        $order_detais->user_id = Auth::user()->id;
        $order_detais->order_id = $order_id;
        $order_detais->plan_id = $plan_id->id;
        $order_detais->amount = $plan_id->plan_amount;
        $order_detais->plan_type = $plan_id->$plan_id;
        $order_detais->save();
    }

    public function get_invoice_list(Request $request)
    {
        $user_order = user_order::where('user_id',Auth::user()->id)->paginate('30');
        return response()->json([
            'status' => 'success',
            'message' => 'get user order list',
            'order_list' =>$user_order
        ]);
    }


    public function get_invoice_details(Request $request)
    {
        $user_order = user_order_detail::where('order_id',$request->order_id)->first();

        return response()->json([
            'status' => 'success',
            'message' => 'get user order details',
            'order_details' =>$user_order
        ]);
    }
}
