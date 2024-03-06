<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class AdminTenantController extends Controller
{
    public function tenant_list()
    {
        return view('admin.tenant.tenantList');
    }

    public function tenant_save(Request $request)
    {

    }
}
