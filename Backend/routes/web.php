<?php

use Carbon\Carbon;
use GuzzleHttp\Client;
use GuzzleHttp\Handler\CurlHandler;
use GuzzleHttp\HandlerStack;
use GuzzleHttp\Middleware;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\AdminLoginController;
use App\Http\Controllers\Admin\AdminController;
use App\Http\Controllers\Admin\AdminPlanController;
use App\Http\Controllers\Admin\AdminUserController;
use App\Http\Controllers\Admin\AdminTenantController;
use App\Http\Controllers\Admin\AdminUniversityController;
use App\Http\Controllers\Admin\AdminEmailTemplateController;
use Illuminate\Support\Str;

// Clear application cache:
Route::get('/clear-cache', function () {
    Artisan::call('optimize:clear');
    return 'Application cache has been cleared';
});

Route::get('/', function(){
    /*$timestamp = '2023-10-02';
    $date = Carbon::createFromFormat('Y-m-d', $timestamp, config('app.timezone'));
    $date->setTimezone('Asia/Dhaka');
    dd($date->startOfDay()->addMinutes(3));*/
//    dd(config('app.checking.message.array'));
    return redirect()->route('admin.login');
});
Route::get('view', function(){
    try {
        $data = [
            'content' => '<p>dfgfdgfd</p><p><br></p><p><br></p><p>dfgfdg <a href="https://laravel.com/" rel="noopener noreferrer" target="_blank">sdfgfds</a>g sdfdsf</p>',
            'list_id' => 12,
            'tenet_id' => 'test1681189688',
            'to' => 'tahmedhera@gmail.com',
            'name' => 'tahmedhera@gmail.com',
            'view' => 'emails.welcome',
            'subject' => 'test'
        ];
        \Illuminate\Support\Facades\Mail::to('16103119@iubat.edu')->send(new \App\Mail\SendSmtpMail($data));
        return view('emails.welcome', $data);
    } catch (Exception $e) {
        dd($e);
    }
});

Route::get('plans', [\App\Http\Controllers\Admin\AdminProductController::class, 'plans'])->name('create.plan');
Route::get('create-plan', [AdminController::class, 'createPlan'])->name('admin.create.plan');

Route::get('/api-documentation', [\App\Http\Controllers\ApiDocController::class, 'api_doc'])->name('api.doc');

Route::get('run-commands',[AdminController::class,'runCampaignCommands']);
Route::get('check-email', [AdminController::class,'sendMail'])->name('send.email');

//Admin Auth
Route::prefix('admin')->group(function () {
    Route::get('/login', [AdminLoginController::class, 'admin_login'])->name('admin.login');
    Route::post('/login/submit', [AdminLoginController::class, 'admin_login_submit'])->name('admin.login.submit');
    Route::get('/logout', [AdminLoginController::class, 'admin_logout'])->name('admin.logout');
});

Route::group(['middleware' => ['auth:admin']], function () {
    Route::prefix('admin')->group(function () {
        Route::get('/dashboard', [AdminController::class, 'admin_dashboard'])->name('admin.dashboard');


        Route::get('/subscription/plan', [AdminPlanController::class, 'plan_list'])->name('admin.subscription.plan');
        Route::post('/subscription/plan/save', [AdminPlanController::class, 'plan_save'])->name('admin.subscription.plan.save');
        Route::post('/subscription/plan/update', [AdminPlanController::class, 'plan_update'])->name('admin.subscription.plan.update');
        Route::post('/subscription/plan/delete', [AdminPlanController::class, 'plan_delete'])->name('admin.subscription.plan.delete');
        Route::get('/plan/facility/{id}', [AdminPlanController::class, 'plan_facility'])->name('admin.plan.facility.view');
        Route::post('/plan/facility/save', [AdminPlanController::class, 'plan_facility_save'])->name('admin.plan.facility.save');


        //credit plan
        Route::get('/credit/plans', [AdminPlanController::class, 'credit_plan'])->name('admin.credit.plan');
        Route::post('/credit/plan/save', [AdminPlanController::class, 'credit_plan_save'])->name('admin.credit.plan.save');
        Route::post('/credit/plan/update', [AdminPlanController::class, 'credit_plan_update'])->name('admin.credit.plan.update');
        Route::post('/credit/plan/delete', [AdminPlanController::class, 'credit_plan_delete'])->name('admin.credit.plan.delete');
        Route::get('/credit/user/list', [AdminPlanController::class, 'credit_user_list'])->name('admin.credit.user.list');

        //product management
        Route::get('/product/list', [\App\Http\Controllers\Admin\AdminProductController::class, 'product_list'])->name('admin.product.management');
        Route::post('/product/type/create/', [\App\Http\Controllers\Admin\AdminProductController::class, 'product_type_create'])->name('admin.product.create.type');
        Route::get('/product/subscription/create/', [\App\Http\Controllers\Admin\AdminProductController::class, 'product_subscription_create'])->name('admin.create.subscription.plan.page');
        Route::get('/product/credit/create/', [\App\Http\Controllers\Admin\AdminProductController::class, 'product_credit_create'])->name('admin.create.credit.plan.page');

        //subscription product
        Route::post('/product/subscription/product/save', [\App\Http\Controllers\Admin\AdminProductController::class, 'subscription_product_save'])->name('admin.subscription.product.save');
        Route::get('/product/subscription/product/edit/{id}', [\App\Http\Controllers\Admin\AdminProductController::class, 'subscription_product_edit'])->name('admin.subscription.product.edit');
        Route::post('/product/subscription/update', [\App\Http\Controllers\Admin\AdminProductController::class, 'subscription_product_update'])->name('admin.subscription.product.update');
        Route::post('/product/subscription/delete', [\App\Http\Controllers\Admin\AdminProductController::class, 'subscription_product_delete'])->name('admin.subscription.product.delete');

        //credit product
        Route::post('/product/credit/product/save', [\App\Http\Controllers\Admin\AdminProductController::class, 'credit_product_save'])->name('admin.credit.product.save');
        Route::get('/product/credit/product/edit/{id}', [\App\Http\Controllers\Admin\AdminProductController::class, 'credit_product_edit'])->name('admin.credit.product.edit');
        Route::post('/product/credit/product/update', [\App\Http\Controllers\Admin\AdminProductController::class, 'credit_product_update'])->name('admin.credit.product.update');
        Route::post('/product/credit/product/delete', [\App\Http\Controllers\Admin\AdminProductController::class, 'credit_product_delete'])->name('admin.credit.product.delete');

        //user plans
        Route::get('/user/plans', [AdminPlanController::class, 'user_plans'])->name('admin.users.plan');
        Route::post('/user/plan/update', [AdminPlanController::class, 'user_plans_update'])->name('admin.user.plan.update');

        //tenant
        Route::get('/tenant/list', [AdminTenantController::class, 'tenant_list'])->name('admin.tenant.list');
        Route::post('/tenant/save', [AdminTenantController::class, 'tenant_save'])->name('admin.tenant.save');

        //user custom order
        Route::get('/user/custom/order', [AdminPlanController::class, 'user_custom_order'])->name('admin.custom.order');
        Route::post('/user/custom/order/save', [AdminPlanController::class, 'user_custom_order_save'])->name('admin.custom.order.save');

        //user manage
        Route::get('/user/create', [AdminUserController::class, 'create_user'])->name('admin.create.user');
        Route::post('/user/create/save', [AdminUserController::class, 'create_user_save'])->name('admin.user.save');
        Route::get('/tenant/view/{id}', [AdminUserController::class, 'tenants_view'])->name('admin.view.tenant');

        //university
        Route::get('/university', [AdminUniversityController::class, 'university'])->name('admin.university');
        Route::post('/university/save', [AdminUniversityController::class, 'university_save'])->name('admin.university.save');
        Route::post('/university/update', [AdminUniversityController::class, 'university_update'])->name('admin.university.update');
        Route::post('/university/delete', [AdminUniversityController::class, 'university_delete'])->name('admin.university.delete');

        //email template
        Route::get('/email/template', [AdminEmailTemplateController::class, 'email_template'])->name('admin.email.template');
        Route::post('/email/template/save', [AdminEmailTemplateController::class, 'email_template_save'])->name('admin.email.template.save');
        Route::post('/email/template/update', [AdminEmailTemplateController::class, 'email_template_update'])->name('admin.email.template.update');
        Route::post('/email/template/delete', [AdminEmailTemplateController::class, 'email_template_delete'])->name('admin.email.template.delete');

        //change password
        Route::get('profile', [AdminController::class, 'profile'])->name('admin.profile');
        Route::post('/change/password/save', [AdminController::class, 'change_password_save'])->name('admin.change.pass.save');
        Route::post('/change/email/save',[AdminController::class,'update_email'])->name('admin.change.email');

        Route::get('tanant/user-plan',[AdminController::class,'tenantPlans'])->name('tanant.user.plan');
        Route::get('addons',[\App\Http\Controllers\Admin\AdminProductController::class,'createAddons'])->name('create.addons');

        Route::get('tenant/users',[\App\Http\Controllers\Admin\AdminUserController::class,'index'])->name('admin.user.index');
        Route::get('tenant/plan/{tenant_id}',[\App\Http\Controllers\Admin\AdminUserController::class,'getUserInfo'])->name('get.user.info');
        Route::post('tenant/user',[\App\Http\Controllers\Admin\AdminUserController::class,'userUpdate'])->name('tenant.user.update');
        Route::post('tenant/plan',[\App\Http\Controllers\Admin\AdminUserController::class,'planUpdate'])->name('tenant.plan.update');
        Route::post('tenant/check-csv',[\App\Http\Controllers\Admin\AdminUserController::class,'checkCsv'])->name('tenant.check.csv');
        Route::post('tenant/list-upload',[\App\Http\Controllers\Admin\AdminUserController::class,'uploadList'])->name('tenant.list.upload');
        Route::get('tenant/delete/{tenant_id}',[\App\Http\Controllers\Admin\AdminUserController::class,'deleteTenant'])->name('tenant.delete');
        Route::get('tenant/status-change/{tenant_id}',[\App\Http\Controllers\Admin\AdminUserController::class,'changeTenantStatus'])->name('tenant.status.change');
        Route::get('tenant/update-db',[\App\Http\Controllers\Admin\AdminUserController::class,'updateTenantDB'])->name('tenant.update.db');

        Route::resource('faqs',\App\Http\Controllers\Admin\FaqController::class)->only('index','store');
        Route::post('faqs/update',[\App\Http\Controllers\Admin\FaqController::class,'update'])->name('faqs.update');
        Route::get('faqs/delete/{id}',[\App\Http\Controllers\Admin\FaqController::class,'destroy'])->name('faqs.destroy');

        Route::get('/domain-trcking',[\App\Http\Controllers\Admin\DomainController::class,'index'])->name('domain.tracking');
        Route::post('/domain-tracking/update',[\App\Http\Controllers\Admin\DomainController::class,'update'])->name('domain.tracking.update');

       //Instruction manage

        Route::get('/instruction',[\App\Http\Controllers\Admin\InstructionController::class,'index'])->name('admin.instruction.get');
        Route::post('/instruction',[\App\Http\Controllers\Admin\InstructionController::class,'store'])->name('admin.instruction.store');

//     //unsubscribe

        Route::get('/unsubscribe-link',[\App\Http\Controllers\Admin\SubscribeLinkController::class,'index'])->name('admin.unsubscribe.link');
        Route::post('/unsubscribe-link',[\App\Http\Controllers\Admin\SubscribeLinkController::class,'store'])->name('store.admin.unsubscribe.link');

    });
});

Route::get('domain-tracking',function (){

    $customDomain = 'cleargivingsmarkets.com';
    $expectedRedirect = 'https://services.growtoro.com/';

    $redirectHistory = [];

    $handlerStack = HandlerStack::create(new CurlHandler());
    $handlerStack->push(Middleware::history($redirectHistory));

    $client = new Client([
        'handler' => $handlerStack,
        'allow_redirects' => false, // Disable automatic redirects
    ]);

    try {
        $response = $client->get("http://{$customDomain}");
        $finalUrl = $response->getHeaderLine('Location');


        if ($finalUrl === 'https://growtoro.com/') {
            // The custom domain is correctly redirecting to 'growtoro.com'
            echo "Redirect is set up correctly.";
        } else {
            // The custom domain is not set up correctly
            echo "Redirect is not set up correctly.";
        }
    } catch (\Exception $e) {
        // An error occurred, the custom domain might not be resolving
        echo "Error: " . $e->getMessage();
    }
})->name('checking.domain');

Route::group(['prefix' => 'intercom'],function (){
   Route::get('events',function (){
       $query = array(
           "user_id" => "sedexercitation1697037799",
           "type" => "event",
           "summary" => true
       );

       $curl = curl_init();

       curl_setopt_array($curl, [
           CURLOPT_HTTPHEADER => [
               "Authorization: Bearer dG9rOmRlMGE3MTBiX2E0MzNfNDY0YV9iZGM2Xzc0YmExY2YxY2Y2MDoxOjA=",
               "Intercom-Version: 2.10"
           ],
           CURLOPT_URL => "https://api.intercom.io/events?" . http_build_query($query),
           CURLOPT_RETURNTRANSFER => true,
           CURLOPT_CUSTOMREQUEST => "GET",
       ]);

       $response = curl_exec($curl);
       $error = curl_error($curl);

       curl_close($curl);

       if ($error) {
           echo "cURL Error #:" . $error;
       } else {
           echo $response;
       }
   });
   Route::get('create-event',function (){

       $curl = curl_init();


       $payload = array(
           "event_name" => "First campaign has been created by james@tree-totub.com",
           "created_at" => now()->timestamp,
           "user_id" => "sedexercitation1697037799",
           "id" => \Illuminate\Support\Str::random(32),
           "email" => "tahmedhera@gmail.com",
           "metadata" => array(
               "invite_code" => "ADDAFRIEND"
           )
       );

       curl_setopt_array($curl, [
           CURLOPT_HTTPHEADER => [
               "Authorization: Bearer dG9rOmRlMGE3MTBiX2E0MzNfNDY0YV9iZGM2Xzc0YmExY2YxY2Y2MDoxOjA=",
               "Content-Type: application/json",
               "Intercom-Version: 2.10"
           ],
           CURLOPT_POSTFIELDS => json_encode($payload),
           CURLOPT_URL => "https://api.intercom.io/events",
           CURLOPT_RETURNTRANSFER => true,
           CURLOPT_CUSTOMREQUEST => "POST",
       ]);

       $response = curl_exec($curl);
       $error = curl_error($curl);

       curl_close($curl);

       if ($error) {
           return "cURL Error #:" . $error;
       } else {
           dd($response);
       }
   });
   Route::get('attributes',function (){
       $id = "652d3542957aa56781e220b0";
       $curl = curl_init();

       $payload = array(
           'name' => "Manual",
       );

       curl_setopt_array($curl, [
           CURLOPT_HTTPHEADER => [
               "Authorization: Bearer dG9rOmRlMGE3MTBiX2E0MzNfNDY0YV9iZGM2Xzc0YmExY2YxY2Y2MDoxOjA=",
               "Content-Type: application/json",
               "Intercom-Version: 2.10"
           ],
           CURLOPT_POSTFIELDS => json_encode($payload),
           CURLOPT_URL => "https://api.intercom.io/contacts/tags",
           CURLOPT_RETURNTRANSFER => true,
           CURLOPT_CUSTOMREQUEST => "POST",
       ]);

       $response = curl_exec($curl);
       $error = curl_error($curl);

       curl_close($curl);

       if ($error) {
           return "cURL Error #:" . $error;
       } else {
           dd(json_decode($response));
       }
   });
});


Route::get('/test-reply',[\App\Http\Controllers\FrontendController::class,'handle']);
