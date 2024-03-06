<?php

declare(strict_types=1);

//use Illuminate\Support\Facades\Route;
//use Stancl\Tenancy\Middleware\InitializeTenancyByDomain;
//use Stancl\Tenancy\Middleware\PreventAccessFromCentralDomains;
//use App\Http\Controllers\FrontendController;
//use App\Http\Controllers\Auth\CustomLoginController;
//use App\Http\Controllers\User\UserController;
//use App\Http\Controllers\User\UserPlanController;
//use App\Http\Controllers\User\UserPaymentController;
//use App\Http\Controllers\User\UserBillingController;
//use App\Http\Controllers\User\UserEmailController;

/*
|--------------------------------------------------------------------------
| Tenant Routes
|--------------------------------------------------------------------------
|
| Here you can register the tenant routes for your application.
| These routes are loaded by the TenantRouteServiceProvider.
|
| Feel free to customize them however you want. Good luck!
|
*/
//
//Route::middleware([
//    'web',
//    InitializeTenancyByDomain::class,
//    PreventAccessFromCentralDomains::class,
//])->group(function () {
////    Route::get('/', function () {
////
////        return 'This is your multi-tenant application. The id of the current tenant is ' . tenant('id');
////    });
//
//    Route::get('/', [FrontendController::class, 'index'])->name('user.login');
//    Route::post('/', [CustomLoginController::class, 'custom_login'])->name('user.custom.login.save');
//
//    Route::group(['middleware' => ['auth']], function () {
//        Route::group(['prefix' => 'user'], function () {
//            Route::get('/', [UserController::class, 'index'])->name('user.dashboard');
//
//
//            //user subscription plan
//            Route::get('/subscription/plan', [UserPlanController::class, 'plan_list'])->name('user.subscription.plan');
//            Route::get('/subscription/plan/choose/{id}', [UserPlanController::class, 'plan_choose'])->name('user.choose.plan');
//
//            // user credit plan
//            Route::get('/credit/plan/', [UserPlanController::class, 'credit_plan'])->name('user.credit.plan');
//            Route::post('/credit/plan/save', [UserPlanController::class, 'credit_plan_save'])->name('user.credit.plan.save');
//
//            //my plan
//            Route::get('/my/plan', [UserPlanController::class, 'my_plan'])->name('user.my.plan');
//            Route::post('/my/plan/change', [UserPlanController::class, 'my_plan_change'])->name('user.plan.change');
//
//            //user payment
//            Route::get('/payment/stripe/{id}/{type}', [UserPaymentController::class, 'pay_stripe'])->name('user.payment.stripe');
//            Route::post('/payment/stripe/submit', [UserPaymentController::class, 'pay_stripe_submit'])->name('user.payment.stripe.submit');
//
//            //billing
//            Route::get('/billing', [UserBillingController::class, 'billing'])->name('user.billing');
//            Route::get('/add/cart/{plan_id}', [UserBillingController::class, 'add_cart'])->name('user.add.cart');
//            Route::get('/view/cart', [UserBillingController::class, 'view_cart'])->name('user.view.cart');
//            Route::get('/cart/data/remove/{id}', [UserBillingController::class, 'cart_data_remove'])->name('user.cart.remove');
//            Route::get('/user/checkout', [UserBillingController::class, 'checkout_user'])->name('user.checkout');
//            Route::post('/user/checkout/submit', [UserPaymentController::class, 'checkout_submit'])->name('user.checkout.submit');
//
//
//            //email download
//            Route::get('/email/download', [UserEmailController::class, 'email_download'])->name('user.email.download');
//            Route::get('/email/download/save/{id}', [UserEmailController::class, 'email_download_save'])->name('user.email.download.save');
//
//
//            //invoice
//            Route::get('/invoice', [UserBillingController::class, 'user_invoice'])->name('user.invoice');
//            Route::get('/invoice/details/{id}', [UserBillingController::class, 'user_invoice_details'])->name('user.invoice.details');
//
//            //change password
//            Route::get('/change/password', [UserController::class, 'change_password'])->name('user.change.password');
//            Route::post('/change/password/save', [UserController::class, 'change_password_save'])->name('user.change.pass.save');
//
//
//        });
//    });
//});
