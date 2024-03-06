<?php

use App\Http\Controllers\API\Auth\TenantLoginController;
use App\Http\Controllers\API\CustomLeadController;
use App\Http\Controllers\API\DripReplyController;
use App\Http\Controllers\API\Emails\DripCampaignController;
use App\Http\Controllers\API\Public\PublicController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::get('create-session/{tenant_id}/{plan_id}', [PublicController::class, 'createSubscription'])->name('create.session');
Route::get('stripe-client-portal/{tenant_id}', [PublicController::class, 'stripeClientPortal'])->name('stripe.client.portal');
Route::get('checkout/success', [PublicController::class, 'success'])->name('checkout.success');
Route::get('checkout/cancel', [PublicController::class, 'cancel'])->name('checkout.cancel');
Route::get('pay-as-you-go/session', [PublicController::class, 'payAsYouGo'])->name('pay-as-you-go.session');
Route::get('pay-as-you-go/checkout-success', [PublicController::class, 'payAsYouGoSuccess'])->name('pay-as-you-go.success');
Route::get('create-addon-session/{tenant_id}/{plan_id}', [PublicController::class, 'createAddonSubscription'])->name('create.addon.session');
Route::get('checkout/addon-success', [PublicController::class, 'addonSuccess'])->name('checkout.addon.success');

Route::middleware('auth:api')->get('/user', function (Request $request) {
	//    return $request->user();
	return response()->json([
		'1' => DB::connection()->getPDO(),
		'2' => DB::connection()->getDatabaseName(),
	]);
});


// ********************************** GLOBAL ROUTES *****************************************************************
Route::post('v1/university/content', [\App\Http\Controllers\API\UniversityController::class, 'university_content']);


// ********************************** USERS API START *****************************************************************

Route::prefix('v1/admin')->group(function () {
	Route::post('/login', [\App\Http\Controllers\API\Auth\AdminLoginController::class, 'admin_login_submit']);
});

// ********************************** USERS API END *****************************************************************


// ********************************** USERS API START *****************************************************************
Route::prefix('v1/tenant')->group(function () {
	Route::post('/register', [TenantLoginController::class, 'tenant_register_submit']);
	Route::post('/login', [TenantLoginController::class, 'tenant_login_submit']);
	Route::post('forgot-password', [TenantLoginController::class, 'forgotPassword']);
	Route::post('reset-password', [TenantLoginController::class, 'resetPassword']);
	Route::post('verify-account', [TenantLoginController::class, 'verifyAccount']);


	Route::group(['middleware' => ['auth:api']], function () {
		Route::prefix('/{tenant_id}')->group(function () {
            Route::post('/get/product/plan', [\App\Http\Controllers\API\User\UserPlanController::class, 'get_product_plan']);
            Route::get('get/credit_amount', [\App\Http\Controllers\API\User\UserPlanController::class, 'getCredits']);

            //user plan
//            Route::post('/get/subscription/plan', [\App\Http\Controllers\API\User\UserPlanController::class, 'get_subscription_plan']);

			//user plan
			//            Route::post('/get/subscription/plan', [\App\Http\Controllers\API\User\UserPlanController::class, 'get_subscription_plan']);

			//credit plan
			Route::post('/get/credit/plan', [\App\Http\Controllers\API\User\UserPlanController::class, 'get_credit_plan']);

			//my plan
			Route::get('get/my-plan', [\App\Http\Controllers\API\User\UserPlanController::class, 'get_my_plan']);
			Route::get('get/active-plan', [\App\Http\Controllers\API\User\UserPlanController::class, 'activePlan']);

			//stripe payment
			Route::post('/plan/purchase', [\App\Http\Controllers\API\User\UserPaymentController::class, 'plan_purchase']);

			//stripe price
			Route::post('/stripe/get/price/list', [\App\Http\Controllers\API\User\UserPaymentController::class, 'get_stripe_price_list']);

			//stripe source
			Route::post('/stripe/get/source', [\App\Http\Controllers\API\User\UserPaymentController::class, 'get_stripe_source']);

			//stripe
			Route::post('/stripe/create/card/token', [\App\Http\Controllers\API\User\UserPaymentController::class, 'stripe_create_card_token']);

			//stripe customer
			Route::post('/stripe/create/customer', [\App\Http\Controllers\API\User\UserPaymentController::class, 'stripe_create_customer']);

			//stripe card
			Route::post('/stripe/card/list', [\App\Http\Controllers\API\User\UserPaymentController::class, 'stripe_card_list']);
			Route::post('/stripe/card/create', [\App\Http\Controllers\API\User\UserPaymentController::class, 'stripe_card_create']);

			//stripe subscription
			Route::post('/stripe/create/subscription', [\App\Http\Controllers\API\User\UserPaymentController::class, 'stripe_create_subscription']);

			//user biling
			Route::post('/save/usage', [\App\Http\Controllers\API\User\UserBilligController::class, 'save_usage']);

			//invoice
			Route::post('/create/new/oder', [\App\Http\Controllers\API\User\UserOrderController::class, 'create_new_order']);
			Route::post('/get/order/list', [\App\Http\Controllers\API\User\UserOrderController::class, 'get_invoice_list']);
			Route::post('/get/order/details', [\App\Http\Controllers\API\User\UserOrderController::class, 'get_invoice_details']);

			//change password
			Route::post('/change/password', [\App\Http\Controllers\API\User\UserController::class, 'change_password_save']);

			//migrations
			Route::post('/uses/db/migration', [\App\Http\Controllers\API\User\UserController::class, 'user_db_migrations']);

			//user profile update
			Route::post('/update/profile', [\App\Http\Controllers\API\User\UserController::class, 'updateProfile']);

			// unibox
			Route::resource('unibox', DripReplyController::class)->only('index','destroy');
            Route::post('unibox/read-unread',[DripReplyController::class,'readUnread']);
            Route::post('unibox/lead-status',[DripReplyController::class,'statusUpdate']);
            Route::post('unibox/remove-lead',[DripReplyController::class,'removeLead']);
            Route::post('unibox/send-mail',[DripReplyController::class,'sendMail']);
            Route::get('unibox/unread-email',[DripReplyController::class,'getEmailCount']);

            //custom lead request
            Route::post('b2b-request',[CustomLeadController::class,'b2b']);
            Route::post('b2c-request',[CustomLeadController::class,'b2c']);
            Route::get('custom-lead-faqs',[\App\Http\Controllers\Admin\FaqController::class,'activeFaqs']);
            Route::post('drip_campaign/check_duplicate',[DripCampaignController::class,'check_duplicate']);
		});
	});
});
// ********************************** USERS API END *****************************************************************



Route::prefix('v1/public/{tenant_id}')->group(function () {

    Route::post('/get/user/order/list', [PublicController::class, 'get_public_order_list']);

    // Dirp campaign Tracking
    Route::get('/drip_campaigns/open/{cp_id}/{sb_id}', [PublicController::class, 'dripOpenCount']);
    Route::get('/drip_campaigns/click/{cp_id}/{sb_id}/{link}', [PublicController::class, 'dripClickCount']);
    Route::get('/drip_campaigns/unsubscribe/{cp_id}/{sb_id}', [PublicController::class, 'dripListUnsubscribe']);

    // Dirp sequence campaign Tracking
    Route::get('/drip_sq_campaigns/open/{cp_id}/{sb_id}', [PublicController::class, 'dripSqOpenCount']);
    Route::get('/drip_sq_campaigns/click/{cp_id}/{sb_id}/{link}', [PublicController::class, 'dripSqClickCount']);
    Route::get('/drip_sq_campaigns/unsubscribe/{cp_id}/{sb_id}', [PublicController::class, 'dripSqListUnsubscribe']);
});


// email api
require_once "email_api.php";
