<?php

namespace App\Console\Commands;

use App\Jobs\DripReplyJob;
use App\Models\Emails\DripCampaign;
use App\Models\Emails\EmailAccount;
use App\Models\Tenant;
use App\Models\tenant_db_name;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Bus;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class DripReplyCm extends Command
{
    protected $signature = 'drip:reply';

    protected $description = 'Dirp Campaing Search reply';

    public function handle()
    {
        $tenants = tenant_db_name::latest()->where('status',1)->get();
        foreach ($tenants as $tenant) {
            $this->check_tenant($tenant);
        }
    }

    public function check_tenant($tenant)
    {
        Config::set('tenancy.database.template_tenant_connection', $tenant->db_con_use);
        DB::purge('tenant');
        Config::set('database.connections.tenant.host', env('DB_HOST'));
        Config::set('database.connections.tenant.username', env('DB_USERNAME'));
        Config::set('database.connections.tenant.password', env('DB_PASSWORD'));
        Config::set('database.connections.tenant.database', $tenant->tenant_db);
        Config::set('database.default', 'tenant');
        DB::reconnect('tenant');
        $this->checkEmail($tenant->tenant_id);
    }

    public function checkEmail($tenet_id): bool
    {
        $campaigns = DripCampaign::whereHas('emails')->whereHas('opens')->where('status', '!=', 0)->get();

        if (count($campaigns) > 0) {
            foreach ($campaigns as $cam) {
                // $smtp_accounts = EmailAccount::whereIn('id',$cam->smtp_id)->where('is_connection_failed',0)->get();

                $smtp_accounts = EmailAccount::whereIn('id',$cam->smtp_id)->get();
                foreach ($smtp_accounts as $smtp) {
                    try {
                        DripReplyJob::dispatch($tenet_id,$smtp->imap_host_name, $smtp->imap_user_name, $smtp->imap_password, $smtp->imap_port, $cam->id, $cam->subject, $cam->list_id, $smtp->id)
                            ->onConnection('sqs_reply_email');
                    } catch (\Exception $e) {
                        Log::info('cannot perform search ', [$e->getMessage(),$smtp->id,$cam->id]);
                    }
                }
            }
        }
        return true;
    }
}
