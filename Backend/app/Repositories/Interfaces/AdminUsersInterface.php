<?php

namespace App\Repositories\Interfaces;

interface AdminUsersInterface
{
    public function init_user_db();

    public function get_all_users();

    public function get_user_plan();

    public function get_user_credit_plan();
}
