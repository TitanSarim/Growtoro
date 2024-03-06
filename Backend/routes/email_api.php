<?php

use App\Http\Controllers\API\BlockListController;
use App\Http\Controllers\API\Emails\DripCampaignController;
use App\Http\Controllers\API\Emails\EmailAccountController;
use App\Http\Controllers\API\Emails\EmailListController;
use App\Http\Controllers\API\Emails\TemplateController;
use App\Http\Controllers\API\User\UserController;
use App\Http\Controllers\API\User\UserPlanController;
use Illuminate\Support\Facades\Route;

Route::get('drip_campaign/unsubscribe-email/{tenant_id}/{list_id}/{email}',[DripCampaignController::class,'unsubscribeView'])->name('unsubscribe.view');
Route::get('drip_campaign/unsubscribe/{tenant_id}/{subscriber_id}',[DripCampaignController::class,'unsubscribe'])->name('unsubscribe.mail');
Route::get('campaign-open/{uid}/{list_id}/{email}/{smtp_id}/{sequence_id}', [DripCampaignController::class,'trackOpen'])->name('track.campaign.open');
Route::get('campaign-clicked', [DripCampaignController::class,'trackClick'])->name('track.campaign.click');

Route::group(['middleware' => ['auth:api']], function () {
    Route::prefix('v1/tenant/{tenant_id}')->group(function () {
        // Email accounts
        Route::get('email_accounts', [EmailAccountController::class, 'index']);
        Route::post('email_account', [EmailAccountController::class, 'store']);
        Route::post('email_account/update', [EmailAccountController::class, 'update']);
        Route::post('email_account/delete', [EmailAccountController::class, 'destroy']);
        Route::post('email_account/status', [EmailAccountController::class, 'status']);

        // Email Templates
        Route::get('templates', [TemplateController::class, 'index']);
        Route::post('template', [TemplateController::class, 'store']);
        Route::post('template/update', [TemplateController::class, 'update']);
        Route::post('template/delete', [TemplateController::class, 'destroy']);

        // Email Lists
        Route::get('email_lists', [EmailListController::class, 'index']);
        Route::get('email_list/{id}', [EmailListController::class, 'getEmaiList']);
        Route::post('email_list', [EmailListController::class, 'store']);
        Route::post('email_list/update', [EmailListController::class, 'update']);
        Route::post('email_list/delete', [EmailListController::class, 'destroy']);

        // List Subscriber
        Route::get('email_lists/subscriber/{list_id}', [EmailListController::class, 'getSubscriber']);
        Route::post('email_list/subscriber/create', [EmailListController::class, 'createSubscriber']);
        Route::post('email_list/subscriber/{list_id}/update/{subsrciber_id}', [EmailListController::class, 'updateSubscriber']);
        Route::post('email_list/subscriber/list/delete', [EmailListController::class, 'destroySubscriber']);
        Route::get('saved-email-list', [EmailListController::class, 'emailList']);
        Route::post('email_list/multiple-subscribers', [EmailListController::class, 'getMultipleSubscribers']);


        // Drip Campaign
        Route::get('drip_campaign', [DripCampaignController::class, 'index']);
        Route::get('drip_campaign/{id}', [DripCampaignController::class, 'getEmailCampaig']);
        Route::post('drip_campaign/create', [DripCampaignController::class, 'store']);
        Route::post('drip_campaign/send-email', [DripCampaignController::class, 'sendEmail'])->name('drip_campaign.send.test.mail');
        Route::post('drip_campaign/update', [DripCampaignController::class, 'update']);
        Route::post('drip_campaign/status', [DripCampaignController::class, 'status']);
        Route::post('drip_campaign/delete', [DripCampaignController::class, 'destroy']);
        Route::post('drip_campaign/clone', [DripCampaignController::class, 'campaignClone']);
        Route::post('parse-csv', [DripCampaignController::class, 'parseCSV']);
        Route::post('setCsvFileWithKey',[DripCampaignController::class,'setCsvFileWithKey']);
        Route::post('email-preview',[DripCampaignController::class,'emailPreview']);


        // Drip Respond
        Route::post('drip_respond/send', [DripCampaignController::class, 'emilRespondSend']);

        Route::get('usage', [UserController::class, 'usage'])->name('usage');

        Route::get('drip_campaign/analytics/list',[DripCampaignController::class,'analyticsList']);
        Route::get('drip_campaign/analytics/stats',[DripCampaignController::class,'analyticsStats']);
        Route::get('drip_campaign/analytics/counters',[DripCampaignController::class,'analyticsCounters']);

        Route::post('cancel-subscription',[UserPlanController::class,'cancelSubscription'])->name('cancel.subscription');


        //Block list
        Route::resource('block-lists',BlockListController::class)->only('index','store');
        Route::post('block-lists/delete', [BlockListController::class, 'destroy']);

        //instruction list

        Route::get('/instruction/list',[\App\Http\Controllers\FrontendController::class,'instruction']);

        Route::post('/delete-account',[UserController::class,'destroy']);
    });
});
