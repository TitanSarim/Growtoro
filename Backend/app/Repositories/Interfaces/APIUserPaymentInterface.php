<?php

namespace App\Repositories\Interfaces;

interface APIUserPaymentInterface
{
    public function create_payment($request, $user_id);

    public function checkout_payment($request, $user_id);
}
