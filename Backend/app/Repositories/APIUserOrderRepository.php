<?php

namespace App\Repositories;

use App\Models\user_order;
use App\Models\user_order_detail;
use App\Repositories\Interfaces\APIUserOrderInterface;
use Gloudemans\Shoppingcart\Facades\Cart;

class APIUserOrderRepository implements APIUserOrderInterface
{
    public function create_invoice($request, $user_id)
    {
        $new_order = new user_order();
        $new_order->user_id = $user_id;
        $new_order->order_id = time() . $user_id . rand(0000, 9999);
        $new_order->total_amount = number_format($request->plan_amount, 2);
        $new_order->name = $request->name;
        $new_order->email = $request->email;
        $new_order->phone = $request->phone;
        $new_order->address = $request->address;
        $new_order->save();
        
        $this->create_order_details($request, $new_order->id, $user_id);

        return response()->json([
            'status' => 'success',
            'message' => 'purchase successfull',
        ]);
    }


    private function create_order_details($request, $order_id, $user_id)
    {
        $cards = Cart::content();

        foreach ($cards as $card) {
            $order_detais = new user_order_detail();
            $order_detais->user_id = $user_id;
            $order_detais->order_id = $order_id;
            $order_detais->plan_id = $card->id;
            $order_detais->amount = $card->price;
            $order_detais->plan_type = $card->options->type;
            $order_detais->save();
        }

        return 'done';
    }


}
