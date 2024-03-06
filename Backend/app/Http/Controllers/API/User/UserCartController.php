<?php

namespace App\Http\Controllers\API\User;

use App\Http\Controllers\Controller;
use App\Models\all_plan;
use Gloudemans\Shoppingcart\Facades\Cart;
use Illuminate\Http\Request;

class UserCartController extends Controller
{
    public function add_cart_single(Request $request)
    {

        $plan = all_plan::where('id', $request->id)->first();
        $data['qty'] = 1;
        $data['id'] = $plan->id;
        $data['name'] = $plan->plan_name;
        $data['price'] = $plan->plan_amount;
        $data['weight'] = 0;
        $data['options']['type'] = $plan->plan_type;

        Cart::add($data);


        return response()->json([
            'status' => 'success',
            'message' => 'cart successfully added',
            'cart_data' => $data,
        ]);
    }


    public function get_cart_data()
    {
        $cart_data = Cart::content();

        return response()->json([
            'status' => 'success',
            'message' => 'get cart data',
            'cart_data' => $cart_data,
        ]);
    }


    public function cart_data_remove(Request $request){


        Cart::remove($request->cart_id);

        return response()->json([
            'status' => 'success',
            'message' => 'cart data remove',
        ]);
    }
}
