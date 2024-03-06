<?php

namespace App\Http\Controllers\API\Public;

use App\Http\Controllers\Controller;
use App\Models\Instruction;
use App\Models\user_order;
use Illuminate\Http\Request;

class PublicController extends Controller
{
    public function get_public_order_list(Request $request)
    {
        $user_orders = user_order::where('user_id',$request->user_id)->paginate(20);

        return response()->json([
            'status' => 'success',
            'message' => 'get order list',
            'orders'=>$user_orders
        ]);
    }

}
