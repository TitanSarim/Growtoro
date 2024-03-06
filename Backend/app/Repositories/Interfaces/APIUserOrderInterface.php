<?php

namespace App\Repositories\Interfaces;

interface APIUserOrderInterface
{
    public function create_invoice($request, $user_id);
}
