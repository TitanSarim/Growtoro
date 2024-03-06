<?php

namespace App\Repositories;

use App\Models\stripe_user_card;
use App\Models\stripe_user_subscription;
use App\Models\User;
use App\Repositories\Interfaces\APISubscriptionInterface;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class APISubscriptionRepository implements APISubscriptionInterface
{
	
	// ======= STRIPE GET PRICE LIST =======
	public function stripe_get_price_list ($request)
	{
		$stripe = new \Stripe\StripeClient(env('STRIPE_SECRET_KEY'));
		$price_list = $stripe->prices->all(['limit' => 100]);
		$array = [];
		foreach ($price_list as $plan) {
			if (!$plan->metadata['active']) {
				$plan->metadata = null;
			}
			array_push($array, $plan);
		}
		return response()->json([
			'status' => 'success',
			'message' => 'get all prices',
			'prices' => $array
		]);
	}
	
	
	// ======= STRIPE CREATE CARD TOKEN =======
	public function stripe_create_card_token ($request)
	{
		$validator = Validator::make($request->all(), [
			'number' => 'required',
			'exp_month' => 'required',
			'exp_year' => 'required',
			'cvc' => 'required',
		], [
			'number.required' => 'Please Enter Card Number',
			'exp_month.required' => 'Please Enter Card Exp Month',
			'exp_year.required' => 'Please Enter Card Exp Year',
			'cvc.required' => 'Please Enter Card CVS',
		]);
		
		
		if ($validator->fails()) {
			return response()->json([
				'status' => 'error',
				'msg' => $validator->errors()
			], 400);
			
			exit();
		}
		
		try {
			$stripe = new \Stripe\StripeClient(
				env('STRIPE_SECRET_KEY')
			);
			$card = $stripe->tokens->create([
				'card' => [
					'number' => $request->number,
					'exp_month' => $request->exp_month,
					'exp_year' => $request->exp_year,
					'cvc' => $request->cvc,
				],
			]);
			
			$user_card = new stripe_user_card();
			$user_card->tenant_id = null;
			$user_card->user_id = Auth::user()->id;
			$user_card->card_id = $card->id;
			$user_card->save();
			
			return response()->json([
				'status' => 'success',
				'message' => 'stripe card successfully created',
				'card_details' => $card
			]);
			
		} catch (\Exception $e) {
			return response()->json([
				'status' => 'error',
				'message' => 'something goes wrong',
			]);
		}
	}
	
	
	// ======= STRIPE GET SOURCE =======
	public function stripe_get_source ($request)
	{
		$validator = Validator::make($request->all(), [
			'customer_id' => 'required',
		], [
			'customer_id.required' => 'Please Enter Customer ID',
		]);
		
		if ($validator->fails()) {
			return response()->json([
				'status' => 'error',
				'msg' => $validator->errors()
			], 400);
			
			exit();
		}
		
		try {
			$stripe = new \Stripe\StripeClient(env('STRIPE_SECRET_KEY'));
			
			$source = $stripe->customers->allSources(
				$request->customer_id,
				['object' => 'card', 'limit' => 3]
			);
			return response()->json([
				'status' => 'success',
				'message' => 'get source',
				'prices' => $source
			]);
		} catch (\Exception $e) {
			return response()->json([
				'status' => 'error',
				'message' => 'something goes wrong',
			]);
		}
	}
	
	
	// ======= STRIPE CREATE CUSTOMER =======
	public function stripe_create_customer ($request)
	{
		$validator = Validator::make($request->all(), [
			'name' => 'required',
			'email' => 'required',
			'phone' => 'required',
		], [
			'name.required' => 'Please Enter Customer Name',
			'email.required' => 'Please Enter Customer Email',
			'phone.required' => 'Please Enter Customer Phone',
		]);
		
		if ($validator->fails()) {
			return response()->json([
				'status' => 'error',
				'msg' => $validator->errors()
			], 400);
			
			exit();
		}
		
		
		try {
			$stripe = new \Stripe\StripeClient(
				env('STRIPE_SECRET_KEY')
			);
			$customer = $stripe->customers->create([
				'name' => $request->name,
				'email' => $request->email,
				'phone' => $request->phone,
				'description' => 'test customer',
			]);
			
			$user = User::where('id', Auth::user()->id)->first();
			$user->strip_cus_id = $customer->id;
			$user->save();
			
			return response()->json([
				'status' => 'success',
				'message' => 'stripe customer successfully created',
				'customer_details' => $customer
			]);
			
		} catch (\Exception $e) {
			return response()->json([
				'status' => 'error',
				'message' => 'something goes wrong',
			]);
		}
	}
	
	
	// ======= STRIPE CARD CREATE =======
	public function stripe_card_create ($request)
	{
		$validator = Validator::make($request->all(), [
			'customer_id' => 'required',
			'card_token' => 'required',
		], [
			'customer_id.required' => 'Please Enter Customer ID',
			'card_token.required' => 'Please Enter Card Token',
		]);
		
		
		if ($validator->fails()) {
			return response()->json([
				'status' => 'error',
				'msg' => $validator->errors()
			], 400);
			
			exit();
		}
		
		
		try {
			$stripe = new \Stripe\StripeClient(
				env('STRIPE_SECRET_KEY')
			);
			$card = $stripe->customers->createSource(
				$request->customer_id,
				['source' => $request->card_token]
			);
			
			return response()->json([
				'status' => 'success',
				'message' => 'stripe customer card successfully created',
				'card_details' => $card
			]);
		} catch (\Exception $e) {
			return response()->json([
				'status' => 'success',
				'message' => 'something goes wrong',
			]);
		}
	}
	
	
	// ======= STRIPE CARD LIST =======
	public function stripe_card_list ($request)
	{
		$validator = Validator::make($request->all(), [
			'customer_id' => 'required',
		], [
			'customer_id.required' => 'Please Enter Customer ID',
		]);
		
		if ($validator->fails()) {
			return response()->json([
				'status' => 'error',
				'msg' => $validator->errors()
			], 400);
			
			exit();
		}
		
		if ($validator->fails()) {
			return response()->json([
				'status' => 'error',
				'msg' => $validator->errors()
			], 400);
			
			exit();
		}
		
		
		try {
			$stripe = new \Stripe\StripeClient(
				env('STRIPE_SECRET_KEY')
			);
			$card_list = $stripe->customers->allSources(
				$request->customer_id,
				['object' => 'card', 'limit' => 3]
			);
			
			return response()->json([
				'status' => 'success',
				'message' => 'stripe customer card list',
				'card_list' => $card_list
			]);
			
		} catch (\Exception $e) {
			return response()->json([
				'status' => 'error',
				'message' => 'something goes wrong',
			]);
		}
	}
	
	
	// ======= STRIPE CREATE SUBSCRIPTION =======
	public function stripe_create_subscription ($request)
	{
		$validator = Validator::make($request->all(), [
			'customer_id' => 'required',
			'price_id' => 'required',
		], [
			'customer_id.required' => 'Please Enter Customer ID',
			'price_id.required' => 'Please Enter Price ID',
		]);
		
		
		if ($validator->fails()) {
			return response()->json([
				'status' => 'error',
				'msg' => $validator->errors()
			], 400);
			
			exit();
		}
		
		
		try {
			$stripe = new \Stripe\StripeClient(
				env('STRIPE_SECRET_KEY')
			);
			$subscription = $stripe->subscriptions->create([
				'customer' => $request->customer_id,
				'items' => [
					['price' => $request->price_id],
				],
			]);
			
			$new_subscription = new stripe_user_subscription();
			$new_subscription->user_id = Auth::user()->id;
			$new_subscription->subscription_id = $subscription->id;
			$new_subscription->save();
			
			
			return response()->json([
				'status' => 'success',
				'message' => 'subscription successfully created',
				'subscription_details' => $subscription
			]);
			
		} catch (\Exception $e) {
			return response()->json([
				'status' => 'error',
				'message' => 'something goes wrong',
			]);
		}
	}
	
	
}