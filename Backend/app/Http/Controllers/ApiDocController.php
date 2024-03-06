<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class ApiDocController extends Controller
{
    public function api_doc()
    {
        return view('swagger.index');
    }
}
