<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Admin;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class AdminController extends Controller
{
    public $users = [];

    public function admin_dashboard()
    {
        return view('admin.index');
    }
    public function runCampaignCommands()
    {
        Artisan::call('drip-campaign:send');
        dd('command run scheduled');
        Artisan::call('drip-sq-campaign:send');
        Artisan::call('drip:reply');
    }

    public function profile()
    {
        return view('admin.pages.profile');
    }

    public function update_email(Request $request)
    {
        $request->validate([
            'email' => 'required|email'
        ]);

        try {
            $user = Admin::where('id', auth()->id())->first();
            $user->email  = $request->email;
            $user->save();
            return back()->with('success', 'Email Successfully Changed');
        } catch (\Exception $e) {
            return back()->with('error', $e->getMessage());
        }
    }

    public function change_password_save(Request $request)
    {
        $request->validate([
            'password' => 'required|confirmed|min:8'
        ]);
        try {
            $user = Admin::where('id', auth()->id())->first();
            $user->password = Hash::make($request->password);
            $user->save();
            return back()->with('success', 'Password Successfully Changed');
        } catch (\Exception $e) {
            return back()->with('error', $e->getMessage());
        }
    }

    public function tenantPlans()
    {
        $tenantConnection = tenant('tenant'); // Replace 'tenant_connection_name' with the actual connection name for the tenant

        DB::connection($tenantConnection)->reconnect(); // Reconnect to the tenant's database connection

        $plans = DB::connection($tenantConnection)->table('user_plan')->pluck('plan_credit');

        dd($plans);

    }
}
