<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Models\all_plan;
use App\Models\Tenant;
use App\Models\tenant_db_name;
use App\Models\user_order;
use App\Models\user_order_detail;
use Gloudemans\Shoppingcart\Facades\Cart;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\DB;

class UserBillingController extends Controller
{
	public function __construct (Request $request)
	{
		$host = $request->getHost();
		$host_id = explode('.', trim($host))[0];
		$tenant = Tenant::where('id', $host_id)->first();
		$db_count = tenant_db_name::where('tenant_id', $host_id)->first();

		Config::set('tenancy.database.template_tenant_connection', $db_count->db_con_use);

		DB::purge('tenant');
		Config::set('database.connections.tenant.host', env('DB_HOST'));
		Config::set('database.connections.tenant.username', 'root');
		Config::set('database.connections.tenant.password', '');
		Config::set('database.connections.tenant.database', $tenant->tenancy_db_name);
		DB::reconnect('tenant');
	}

	public function billing ()
	{
		$plan = all_plan::active()->subscriptionPlan()->get();
		$credit = all_plan::active()->creditPlan()->get();
		return view('user.billing.billing', compact('plan', 'credit'));
	}


	public function add_cart ($plan_id)
	{

		$plan = all_plan::where('id', $plan_id)->first();

		$data['qty'] = 1;
		$data['id'] = $plan->id;
		$data['name'] = $plan->plan_name;
		$data['price'] = $plan->plan_amount;
		$data['weight'] = 0;
		$data['options']['type'] = $plan->plan_type;

		Cart::add($data);
		return back()->with('success', 'Cart Added');
	}

	public function view_cart ()
	{

		$cart_data = Cart::content();

		return view('user.billing.viewCart', compact('cart_data'));
	}


	public function cart_data_remove ($id)
	{
		Cart::remove($id);
		return back()->with('success', 'Cart Removed');
	}


	public function checkout_user ()
	{
		return view('user.billing.checkout');
	}


	public function user_invoice ()
	{
		$orders = user_order::where('user_id', Auth::user()->id)->paginate(20);
		return view('user.billing.invoiceList', compact('orders'));
	}

	public function user_invoice_details ($id)
	{
		$orders = user_order::where('id', $id)->first();
		$orders_details = user_order_detail::where('order_id', $id)->with('plan')->get();
		return view('user.billing.invoiceDetails', compact('orders', 'orders_details'));
	}
}
