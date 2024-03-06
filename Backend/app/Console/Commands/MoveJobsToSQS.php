<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;

class MoveJobsToSQS extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'move-jobs-to-sqs';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'move-jobs-to-sqs';

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle()
    {
	// Use the DB facade to get pending jobs. Adjust table/column names as necessary.
    	$jobs = \DB::table('jobs')->get();

    	foreach ($jobs as $job) {
            // Decode the job payload
            $payload = json_decode($job->payload, true);

            $isDripCampaignSend = $payload['data']['commandName'] === "App\Jobs\DripCampaignSend";

            // Dispatch the job to SQS
            if($isDripCampaignSend){
	        \Queue::pushRaw(json_encode($payload), null, ['connection' => 'sqs_send_email']);
            }else{
                \Queue::pushRaw(json_encode($payload), null, ['connection' => 'sqs_reply_email']);
            }

            // Optionally, you can delete the job from the database after pushing to SQS
            // \DB::table('jobs')->where('id', $job->id)->delete();
    	}

    	$this->info('Jobs migrated to SQS!');
    }
}
