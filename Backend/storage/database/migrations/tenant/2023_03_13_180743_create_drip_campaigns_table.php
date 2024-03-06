<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('drip_campaigns', function (Blueprint $table) {
            $table->id();
            $table->uuid('dirp_uid')->unique();
            $table->foreignId('user_id')->constrained()->onUpdate('cascade')->onDelete('cascade');
            $table->string('campaign_name');
            $table->string('list_id');            
            $table->bigInteger('smtp_id')->nullable();
            $table->string('from_name');
            $table->string('from_email');
            $table->string('subject', 500);
            $table->longText('email_body')->nullable();
            $table->timestamp('sent_at')->nullable();
            $table->timestamp('started_at')->nullable();
            $table->timestamp('finished_at')->nullable();
            $table->string('offset', 20)->default(0);
            $table->string('total', 20)->default(0);
            $table->string('log_file')->nullable();
            $table->string('delay_email')->nullable();
            $table->string('max_email')->default(200);
            $table->string('max_email_offset')->nullable();
            $table->boolean('tracking')->default(1);
            $table->boolean('stop_on_reply')->default(1);
            $table->boolean('status')->default(0);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('drip_campaigns');
    }
};
