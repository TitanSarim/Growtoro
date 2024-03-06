<?php

namespace App\Repositories\Interfaces;

interface APISubscriptionInterface
{
	public function stripe_get_price_list ($request);
	
	public function stripe_create_card_token ($request);
	
	public function stripe_get_source ($request);
	
	public function stripe_create_customer ($request);
	
	public function stripe_card_list ($request);
	
	public function stripe_card_create ($request);
	
	public function stripe_create_subscription ($request);
}