<?php

namespace App\Console\Commands;

use App\Jobs\DripSequenceSend;
use App\Models\Emails\DripCampaign;
use App\Models\Emails\DripSequence;
use App\Models\Emails\DripSqUrl;
use App\Models\Emails\TimeFilter;
use App\Models\Tenant;
use App\Models\tenant_db_name;
use Illuminate\Console\Command;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class SendDripSequence extends Command
{
    public $days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'drip-sq-campaign:send';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Drip Sequence Queue every 10 minutes';

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle()
    {
        Tenant::all()->each(
        function($tenant){
            $this->check_tenant($tenant);
        });
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
            $this->drip_sq_run($tenant->id);

            // Log::info("Tenant ID : ".$tenant);
            // Log::info("Tenant Database : ".Config::get('database.connections.tenant.database'));
        }
    }

    public function drip_sq_run($tenet_id)
    {
        $campaign = DripSequence::where('status',1)->orWhere('status',2)->get();
        if($campaign){
            foreach ($campaign as  $cmp) {
                $time_filter = $this->time_filter($cmp);
                if($time_filter) {
                    if($cmp->status == 1){
                        $this->addCampaignUrl($cmp);
                        $log_file = $this->create_file($cmp->sq_uid);
                        $offset = $this->batchListEmail($cmp, $tenet_id);
                        if($offset){
                            $data = ['offset' => $offset[0], 'total'=> $offset[1],  'log_file' => $log_file];
                            $cmp->update($data);
                        }

                    } else {
                        $offset = $this->batchListEmail($cmp, $tenet_id);
                        if($offset) {
                            $data = ['offset' => $offset[0], 'total'=> $offset[1]];
                            $cmp->update($data);
                        }
                    }
                }
            }
        }
    }

    public function time_filter($cmp)
    {
        $time = TimeFilter::where('drip_id', $cmp->drip_id)->first();
        if ($time && $time->time_zone)
        {
            date_default_timezone_set($time->time_zone);
        }

        // waiting time filter
        $dirp = DripCampaign::find($cmp->drip_id);
        if (!$dirp)
        {
            return false;
        }
        $email = $this->get_email($dirp->log_file, $cmp->offset);
        if(is_array($email))
        {
            $datetime1 = new \DateTime($email[2]);
            $datetime2 = new \DateTime(now());
            $interval = $datetime1->diff($datetime2);
            if($cmp->wait_time != null) {
                if($interval->format('%a') < $cmp->wait_time) {
                    return false;
                }
            }
            // end of waiting time filter

            $days  = explode(',', $time->days);
            $today = date('l', time());
            $day_found = false;
            for ($i=0; $i <count($days) ; $i++) {
                if($this->days[$days[$i]] == $today){
                    $day_found = true;
                }
            }

            if($day_found){
                $now = now()->format('H:i');
                if($now >= $time->start_at && $now <= $time->stop_at) {
                    return true;
                }
            }
        }


        return false;
    }

    public function addCampaignUrl($cmp)
    {
        $campaign = $cmp;
        if ($campaign) {
            $body = $campaign->sq_body;
            $links = $this->getLinks($body);
            $cp = DripSqUrl::where('sq_id', $campaign->id)->get();
            if(count($cp)){
                for ($i=0; $i <count($links) ; $i++) {
                    $con = true;
                    foreach ($cp as $cp_value){
                        if($cp_value->destination == $links[$i]){
                            $con = false;
                        }
                    }
                    if($con){
                        DripSqUrl::create(['drip_id' => $campaign->id, 'hash' => Str::uuid()->toString(), 'destination' => $links[$i]]);
                    }
                }
            } else {
                for ($i=0; $i <count($links) ; $i++) {
                    DripSqUrl::create(['drip_id' => $campaign->id, 'hash' => Str::uuid()->toString(), 'destination' => $links[$i]]);
                }
            }
        }
    }

    public function getLinks($body)
    {
        $dom = new \DOMDocument;
        $dom->loadHTML($body);
        $data = [];
        foreach ($dom->getElementsByTagName('a') as $node) {
            $data[] = $node->getAttribute( 'href' );
        }
        return array_merge(array_unique($data));
    }

    public function create_file($hash)
    {
        $dir = public_path().'/campaign/dripsequence';
        $file = public_path().'/campaign/dripsequence/'.$hash.'.log';
        if (!file_exists($dir)) {
            mkdir($dir, 0755, true);
            exec("chown -R www-data:ubuntu ".$dir);
        }
        if(!file_exists($file)){
            touch($file);
            chmod($file, 0644);
            exec("chown -R www-data:ubuntu ".$file);
        }
        return $file;
    }


    public function batchListEmail($cmp, $tenet_id)
    {
        if($cmp->sq_id == null) {
            $dirp = DripCampaign::find($cmp->drip_id);
            if(!file_exists($dirp->log_file)) {
                return;
            }
            $total_list = count(file($dirp->log_file));
            if($cmp->offset < $total_list){
                if($cmp->offset < $total_list) {
                    $email = $this->get_email($dirp->log_file, $cmp->offset);
                    if($email) {
                        DripSequenceSend::dispatch($cmp->id, $email[0], $email[1], $tenet_id);
                        return [$cmp->offset + 1, $total_list, 2];
                    }
                }
            }
        } else {
            $dirp_sq = DripSequence::find($cmp->sq_id);
            if(!file_exists($dirp_sq->log_file)) {
                return;
            }
            $total_list = count(file($dirp_sq->log_file));
            if($cmp->offset < $total_list){
                $email = $this->get_email($dirp_sq->log_file, $cmp->offset);
                if($email) {
                    DripSequenceSend::dispatch($cmp->id, $email[0], $email[1], $tenet_id);
                    return [$cmp->offset + 1, $total_list, 2];
                }
            }
        }

    }

    public function get_email($file, $offset)
    {
        if(!file_exists($file)){
            return false;
        }
        if(count(file($file)) == 0){
            return false;
        }
        $spl = new \SplFileObject($file);

        if(empty($offset)){
            $spl->seek(0);     // Seek to line no. 10,000
            $em = explode(',', $spl->current());
            $email = $em[0];
            $hash = $em[1];
            $time = $em[2];
        } else {
            $spl->seek($offset);     // Seek to line no. 10,000
            $em = explode(',', $spl->current());
            $email = $em[0];
            $hash = $em[1];
            $time = $em[2];
        }
        return [$email, $hash, $time];
    }
}
