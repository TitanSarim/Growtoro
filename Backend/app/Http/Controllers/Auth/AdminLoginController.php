<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\Admin;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

class AdminLoginController extends Controller
{


    public function __construct()
    {
        $this->middleware('guest:admin', ['except' => ['admin_logout']]);
    }

    public function admin_login()
    {

        return view('auth.adminLogin');
    }

    public function admin_login_submit(Request $request)
    {
        if (Auth::guard('admin')->attempt(['email' => $request->email, 'password' => $request->password], $request->remember)) {
            return redirect(route('admin.dashboard'));
        } else {
            return back()->with('login_error', 'Invalid Credentials');
        }
    }


    public function admin_logout()
    {
        Auth::guard('admin')->logout();
        return redirect(route('admin.login'));
    }
}
