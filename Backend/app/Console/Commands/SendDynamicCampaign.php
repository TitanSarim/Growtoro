<?php

namespace App\Console\Commands;

use App\Jobs\DripCampaignSend;
use App\Models\BlockList;
use App\Models\DripEmail;
use App\Models\Emails\DripCampaign;
use App\Models\Emails\DripSequence;
use App\Models\Emails\DripUrl;
use App\Models\Emails\EmailListSubscriber;
use App\Models\Emails\TimeFilter;
use App\Models\EmailSequence;
use App\Models\Tenant;
use App\Models\tenant_db_name;
use Carbon\Carbon;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

class SendDynamicCampaign extends Command
{
    protected $signature = 'dynamic-campaign:send {--tenant_id=} {--campaign_id=} {--subscriber_id=} {--time=} {--sequence_id=}';

    public function __construct()
    {
        parent::__construct();
    }

    public function handle()
    {
        // Access the passed options and arguments
        $tenant_id      = $this->option('tenant_id');
        $campaign_id    = $this->option('campaign_id');
        $subscriber_id  = $this->option('subscriber_id');
        $time           = $this->option('time');
        $sequence_id    = $this->option('sequence_id');
        DripCampaignSend::dispatch($campaign_id, $subscriber_id, $tenant_id,$sequence_id);
    }


    public function check_tenant($tenant)
    {
        $db_count = tenant_db_name::where('tenant_id', $tenant->id)->first();
        if ($db_count){
            Config::set('tenancy.database.template_tenant_connection', $db_count->db_con_use);
            DB::purge('tenant');
            Config::set('database.connections.tenant.host', env('DB_HOST'));
            Config::set('database.connections.tenant.username', env('DB_USERNAME'));
            Config::set('database.connections.tenant.password', env('DB_PASSWORD'));
            Config::set('database.connections.tenant.database', $tenant->tenancy_db_name);
            Config::set('database.default', 'tenant');
            DB::reconnect('tenant');
            $this->drip_campaign_run($tenant->id);
        }
    }

    public function drip_campaign_run($tenet_id)
    {
        $campaign = DripCampaign::withCount('emails')->where('status',1)->orWhere('status',2)->get();

        foreach ($campaign as  $cmp)
        {
            $time_filter = $this->time_filter($cmp);

        }

    }

    public function batchListEmail($cmp, $tenet_id,$sequence)
    {
        $total_sent = $sequence->total;//offset  emails_count
        $subscriber_list = EmailListSubscriber::where([['list_id', $cmp->list_id ], ['status', 1]])->skip($total_sent)->take(1)->get();
        $total_list = EmailListSubscriber::where([['list_id', $cmp->list_id ], ['status', 1]])->count();
        if($total_sent < $total_list) {
            if($subscriber_list){
                foreach ($subscriber_list as $key => $list) {
                    if ($total_sent == 0)
                    {
                        Log::info('job dispatch',[true]);
                        DripCampaignSend::dispatch($cmp->id, $list->id, $tenet_id,$sequence->id);

                    }
                    else{
                        $time = $cmp->delay_email * $total_sent;
                        Log::info('job dispatch',[true]);

                        DripCampaignSend::dispatch($cmp->id, $list->id, $tenet_id,$sequence->id)->delay(now()->addMinutes($time));
                    }
                }
            }
        } elseif(!$cmp->total){
            if($subscriber_list){
                foreach ($subscriber_list as $list) {
                    if ($total_sent == 0)
                    {
                        DripCampaignSend::dispatch($cmp->id, $list->id, $tenet_id,$sequence->id);
                    }
                    else{
                        $time = $cmp->delay_email * $total_sent;
                        DripCampaignSend::dispatch($cmp->id, $list->id, $tenet_id,$sequence->id)->delay(now()->addMinutes($time));
                    }
                }
            }
        }
        if ($total_list > $total_sent)
        {
            $cmp->increment('offset');
        }
        return [count($subscriber_list), $total_list, 2];
    }
}
