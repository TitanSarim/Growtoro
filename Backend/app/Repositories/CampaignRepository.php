<?php

namespace App\Repositories;

use App\Jobs\DripCampaignSend;
use App\Models\BlockList;
use App\Models\DripEmail;
use App\Models\Emails\DripCampaign;
use App\Models\Emails\DripSequence;
use App\Models\Emails\DripUrl;
use App\Models\Emails\EmailListSubscriber;
use App\Models\Emails\TimeFilter;
use App\Models\Emails\EmailQueueRecord;
use App\Models\UniboxThread;
use Carbon\Carbon;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\DB;

class CampaignRepository
{
    protected $time_zone;
    protected $days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

    public function campaignRun($tenet_id)
    {
        $campaigns = DripCampaign::withCount('emails')
            ->where(function ($query) {
                $query->where('status', 1)
                    ->orWhere('status', 2);
            })
            ->get();

        foreach ($campaigns as $campaign) {
            

            $time_filter = $this->timeFilter($campaign);

            if ($time_filter) {
                $total_today_mail_sent = DripEmail::where('list_id', $campaign->id)
                    ->whereBetween('created_at', [Carbon::today()->startOfDay(), Carbon::today()->endOfDay()])
                    ->count();

                $can_go = $total_today_mail_sent < $campaign->max_email;

                if (!$can_go) {
                    continue;
                }

                // Update the counter daily to 0 for delay_email 
                // $campaign->update(['daily_delay_counter' => 0]);


               $subscriberList = EmailListSubscriber::where([
                    ['list_id', $campaign->list_id],
                    ['status', 1]
                ])->count();

                $sequences = DripSequence::where('drip_id', $campaign->id)
                    ->where('total', '<', $subscriberList)
                    ->orderBy('position', 'asc')
                    ->where('start_date', '<=', date('Y-m-d'))
                    ->get();

                // If there are sequences to process
                if ($sequences->count() > 0) {
                    $this->processSequences($campaign, $tenet_id, $sequences,$subscriberList);
                }

                $campaign->update(['finished_at' => now()]);
            }
        }

        return true;
    }

    protected function processSequences($campaign, $tenet_id, $sequences,$subscriberListCount)
    {

        if($sequences->count() > 1){

            // Calculate the total emails for each step based on the distribution ratio
            // lowest position step give the 75% ration 

            $totalEmails = $campaign->max_email;
            $lowestPositionSequence = $sequences->sortBy('position')->first();
            $lowestPositionAllocation = ceil((75 / 100) * $totalEmails);

            $emailAllocations = [
                $lowestPositionSequence->id => $lowestPositionAllocation,
            ];

            // Calculate how many emails are free based on the total sent and total list from the lowest position sequence
            $remainingFreeEmails = max(0, ($lowestPositionSequence->total + $lowestPositionAllocation) - $subscriberListCount);
            // if there are any freeemails remains than assign the new ration accordingly
            if($remainingFreeEmails > 0 ){

                $emailAllocations = [
                    $lowestPositionSequence->id => $lowestPositionAllocation - $remainingFreeEmails,
                ]; 
            }
            
            // getting the record except $lowestPositionSequence
            $remainingSequences = $sequences->except([$lowestPositionSequence->id]);

            if($remainingSequences->count()){

                $remaining = $totalEmails - $lowestPositionAllocation;

                // if there are any remainingFreeEmails than add it to the remaining to give that percentage added in 25%;

                if ($remainingFreeEmails > 0) {

                    $remaining = $totalEmails - $lowestPositionAllocation;
                    $remaining  = $remaining +  $remainingFreeEmails;
                }
                // Calculate the remaining 25% and distribute equally among remaining sequences
                $remainingAllocation = ceil($remaining / $remainingSequences->count());
                

                foreach ($remainingSequences as $sequence) {
                    $emailAllocations[$sequence->id] = $remainingAllocation;
                }

            }

        }
        else{

            $totalEmails = $campaign->max_email;
            $lowestPositionSequence = $sequences->sortBy('position')->first();
            $lowestPositionAllocation = ceil((100 / 100) * $totalEmails);

            $emailAllocations = [
                $lowestPositionSequence->id => $lowestPositionAllocation,
            ];

        }       

        date_default_timezone_set($this->time_zone);

        $currenttime  = now();

        // Fetch and send emails for each sequence
        foreach ($sequences as $sequence) {

            $allocatedEmails = $emailAllocations[$sequence->id];

            $this->batchListEmail($campaign, $tenet_id, $sequence, $allocatedEmails,$currenttime);
        }
    }

    public function batchListEmail($campaign, $tenet_id, $sequence, $allocatedEmails,$currenttime)
    {
        $data = ['max_email_offset' => $campaign->max_email_offset + 1];

        if ($sequence->status == 1) {
            $data['started_at'] = now();
        }

        $campaign->update($data);

        $total_sent = $sequence->total;
        $total_today_mail_sent = DripEmail::where('list_id', $campaign->id)
            ->whereDate('created_at', Carbon::today())
            ->count();
        $can_go = $total_today_mail_sent < $campaign->max_email;
    
        if (!$can_go) {
            return false;
        }
    
        date_default_timezone_set($this->time_zone);

        $subscriberList = EmailListSubscriber::where([
            ['list_id', $campaign->list_id],
            ['status', 1]
        ])->skip($total_sent)->take($allocatedEmails)->get();

 
        $total_list         = EmailListSubscriber::where([['list_id', $campaign->list_id ], ['status', 1]])->count();
        

        foreach ($subscriberList as $subscriber) {

            $block_list = BlockList::where('email', $subscriber->email)->first();

            if ($block_list) {
                $this->updateSequence($sequence, $total_list);
                continue;
            }

            if ($campaign->stop_on_reply == 1 && $this->hasReply($subscriber->email, $campaign->id)) {
                $this->updateSequence($sequence, $total_list);
                continue;
            }

            // $this->dispatchEmail($total_sent,$total_list,$campaign,$subscriber->id,$tenet_id,$sequence->id,$currenttime);

            EmailQueueRecord::create([
                'drip_id'       => $campaign->id,
                'subscriber_id' => $subscriber->id,
                'tenant_id'     => $tenet_id,
                'sequence_id'   => $sequence->id,
                'timezone'      => $this->time_zone,
                'delay'         => $currenttime,
            ]);

            
            $delayInMinutes = min($campaign->delay_email, 900); // Ensure it doesn't exceed 900 seconds
            $currenttime = $currenttime->addMinutes($delayInMinutes);
        
            // $udata['daily_delay_counter'] = $campaign->daily_delay_counter + 1;
            // $campaign->update($udata);
            
            $currentSeqData['total'] = $sequence->total + 1;
            if($currentSeqData['total'] == $total_list)
            {
                $currentSeqData['status'] = 0;
            }
            $sequence->update($currentSeqData);
        }

        return true;
    }


    public function timeFilter($cmp): bool
    {
        $time = TimeFilter::where('drip_id', $cmp->id)->first();

        if ($time && $time->time_zone)
        {
            $this->time_zone = $time->time_zone;
            date_default_timezone_set($time->time_zone);
        }
        $days  = explode(',', $time->days);
        $today = date('l', time());

        $day_found = false;

        for ($i=0; $i <count($days) ; $i++)
        {
            if($this->days[$days[$i]] == $today)
            {
                $day_found = true;
            }
        }

        if($day_found)
        {
            $now = date('H:i');
            if($now >= $time->start_at && $now <= $time->stop_at)
            {
                return true;
            }
        }

        return false;
    }


    public function dispatchCheck($sequence,$total_sent,$camp_id,$max_email,$delay_email,$subscriber_id)
    {
        $timestamp  = $sequence->position > 1 ? $sequence->start_date . " 00:00:00" : $sequence->created_at;
        $date       = Carbon::createFromFormat('Y-m-d H:i:s', $timestamp, config('app.timezone'));
        $date->setTimezone($this->time_zone);

        /*$last_mail  = DripEmail::where('list_id',$camp_id)->whereDate('created_at',Carbon::today())->latest()->first();

        if ($last_mail)
        {
            if ($last_mail->subscriber_id == $subscriber_id)
            {
                return false;
            }
            $send_time = $last_mail->created_at;
            $date      = Carbon::createFromFormat('Y-m-d H:i:s', $send_time, config('app.timezone'));
            $date->setTimezone($this->time_zone);

            return $date->addMinutes($delay_email) <= now();
        }
        else{
            return true;
        }*/

        return $sequence->position > 1
            ? $date->startOfDay()->addMinutes($total_sent * $delay_email) <= now()
            : $date->addMinutes($total_sent * $delay_email) <= now();
    }
    public function updateSequence($sequence,$total_list)
    {
        $currentSeqData['total'] = $sequence->total+1;
        if($currentSeqData['total'] == $total_list)
        {
            $currentSeqData['status'] = 0;
        }
        return $sequence->update($currentSeqData);
    }
    public function hasReply($email,$camp_id)
    {
        return UniboxThread::where('recipient_mail',$email)->whereHas('replies',function ($query) use ($camp_id){
            $query->where('drip_id',$camp_id);
        })->first();
    }
     public function dispatchEmailOLd($total_sent,$total_list,$cmp,$subscriber_id,$tenet_id,$sequence_id,$currenttime): bool
    {
        $sqs_array = ['sqs_send_email', 'sqs_send_email_2', 'sqs_send_email_3', 'sqs_send_email_4', 'sqs_send_email_5'];
        $mailer = array_rand($sqs_array);
        if ($mailer < 0) {
            $mailer = 0;
        }
        if ($total_sent < $total_list || !$cmp->total) {
            
            $daily_delay_counter = $cmp->daily_delay_counter;
            // $delay = $this->calculateDelay($daily_delay_counter, $cmp->delay_email);
         
            date_default_timezone_set($this->time_zone);
            
            // for local environment
            // DripCampaignSend::dispatch($cmp->id, $subscriber_id, $tenet_id, $sequence_id,$this->time_zone)
            //                 ->delay($currenttime);
            
            // DripCampaignSend::dispatch($cmp->id, $subscriber_id, $tenet_id, $sequence_id,$this->time_zone)
            //     ->onConnection($sqs_array[$mailer])->delay($currenttime);
        }

        if ($total_list > $total_sent) {
            $cmp->increment('offset');
        }
        return true;
    }
    public function dispatchEmail($cmp_id,$subscriber_id,$tenet_id,$sequence_id,$timezone): bool
    {
        $sqs_array = ['sqs_send_email', 'sqs_send_email_2', 'sqs_send_email_3', 'sqs_send_email_4', 'sqs_send_email_5'];
        $mailer = array_rand($sqs_array);
        if ($mailer < 0) {
            $mailer = 0;
        }

         
        date_default_timezone_set($timezone);
        
        // for local environment
        DripCampaignSend::dispatch($cmp_id, $subscriber_id, $tenet_id, $sequence_id,$timezone);
        
        // DripCampaignSend::dispatch($cmp_id, $subscriber_id, $tenet_id, $sequence_id,$timezone)
        //     ->onConnection($sqs_array[$mailer]);
        
        return true;
    }

    protected function calculateDelay($totalSent, $delayEmail)
    {
         
        $delayInMinutes = $totalSent * $delayEmail;
        // $delayInSeconds = $delayInMinutes * 60; 
        return $delayInMinutes;
    }

    public function changeUserInfo($email_other_info,$sender_name,$subject,$html): array
    {
        $mark_tag           = [];
        $marks_body         = [];
        $user_details       = json_decode($email_other_info);
        foreach ($user_details as $key=>$tag)
        {
            $mark_tag[] = '{'.$key."}";
            $marks_body[] = $tag;
        }

        if ($sender_name)
        {
            $mark_tag[] = "{sending_account_full_name}";
            $marks_body[] = $sender_name;
            $mark_tag[] = "{Sending_account_full_name}";
            $marks_body[] = $sender_name;
        }

        $subject    = str_replace($mark_tag, $marks_body, $subject);
        $html       = str_replace($mark_tag, $marks_body, $html);

        return [
            'subject'   => $subject,
            'html'      => $html
        ];
    }

    public function parseUrl($cam_id,$tracking,$html,$domain,$email="",$tenet_id="",$sequence_id)
    {
        $cp_url = DripUrl::where('drip_id', $cam_id)->get();

        if($tracking && count($cp_url) > 0) {
            $urls = $cp_url->pluck('destination')->toArray();
            foreach ($urls as $url) {
                $pattern = 'href="' . trim($url) . '"';
                $replacement = 'href="' . route('track.campaign.click', ['list_id' => $email->list_id, 'user_tenant_id' => $tenet_id, 'email' => $email->email, 'url' => $url,'sequence_id' => $sequence_id]) . '"';
                if($domain)
                {                
                    $domain = trim($domain);
                    $url = trim(env('APP_URL'));
                    $finalDomain = "https://$domain";
                    $finalDomain = trim($finalDomain);
                    $replacement = str_replace($url,$finalDomain,$replacement);
                }

                $html = str_replace($pattern, $replacement, $html);
            }
        }
        return $html;
    }

    public function configMail($sender_info): string
    {
        $mailer = Str::random(6).'_smtp';
        $stmp               = [
            'transport'     => 'smtp',
            'host'          => $sender_info->smtp_host_name,
            'port'          => (int)$sender_info->smtp_port,
            'encryption'    => $sender_info->smtp_port == '465'?'ssl':'tls',
            'username'      => $sender_info->smtp_user_name,
            'password'      => $sender_info->smtp_password,
            'from'          =>
                [
                    //FIXME TWO BOTTOM LINES MUST BE GIVEN A DO OVER PROBABLY
                    'address'   => $sender_info->smtp_from_email,
                    'name'      => $sender_info->smtp_from_name,
                ],
        ];
        config(["mail.mailers.$mailer" => $stmp]);
        return $mailer;
    }

    public function addReferences($position,$camp_id): array
    {
        $references = [];
        if ($position > 1)
        {
            $need_to_be_iterated = $position - 1;
            for ($i = 0; $i < $need_to_be_iterated; $i++) {
                $current_position = $i+1;
                $loop_sequence = DripSequence::where('drip_id',$camp_id)->where('position',$current_position)->first();

                if ($loop_sequence)
                {
                    $references[] = "$loop_sequence->sq_uid@growtoro.com";
                }
            }
        }
        return $references;
    }

    public function dispatchDelayEmail($tenant_id){

        // Get all unique timezones
        
        $timezones = EmailQueueRecord::distinct('timezone')->pluck('timezone');

        // Loop through each timezone and fetch records
        foreach ($timezones as $timezone) {

            date_default_timezone_set($timezone);

            $currentMinute = now();
            // $currentMinute = now()->addMinute(); // Add a small margin

            $records = EmailQueueRecord::where('timezone', $timezone)
                ->where('delay', '<=', $currentMinute)
                ->get();

            foreach ($records as $record) {

                // $delayInMinutes = now($record->timezone)->diffInMinutes($record->delay);
               
                $this->dispatchEmail($record->drip_id,$record->subscriber_id,$record->tenant_id,$record->sequence_id,$timezone);
              

                // Delete the processed record from the database
                $record->delete();
            }
        }

       

    }
}
