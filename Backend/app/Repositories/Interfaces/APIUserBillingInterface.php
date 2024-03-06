<?php

namespace App\Repositories\Interfaces;

interface APIUserBillingInterface
{
	public function save_bill_usage ($request, $user_id);
}