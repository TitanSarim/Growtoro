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
use App\Models\UniboxThread;
use App\Repositories\CampaignRepository;
use Carbon\Carbon;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

class SendDripCampaign extends Command
{
    protected $signature    = 'drip-campaign:send';

    protected $description  = 'Drip Campaign Queue every 10 minutes';

    public function handle(): bool
    {
        $tenants = tenant_db_name::where('status',1)->latest()->get();
        foreach ($tenants as $tenant)
        {
            Config::set('tenancy.database.template_tenant_connection', $tenant->db_con_use);
            DB::purge('tenant');
            Config::set('database.connections.tenant.host', env('DB_HOST'));
            Config::set('database.connections.tenant.username', env('DB_USERNAME'));
            Config::set('database.connections.tenant.password', env('DB_PASSWORD'));
            Config::set('database.connections.tenant.database', $tenant->tenant_db);
            Config::set('database.default', 'tenant');
            DB::reconnect('tenant');
            $repo = new CampaignRepository();
            $repo->campaignRun($tenant->tenant_id);
        }
        return true;
    }
}
