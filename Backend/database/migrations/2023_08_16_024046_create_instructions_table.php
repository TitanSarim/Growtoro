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
        Schema::create('instructions', function (Blueprint $table) {
            $table->id();
            $table->text('smtp_details')->nullable();
            $table->text('smtp_details_video')->nullable();
            $table->text('imap_details')->nullable();
            $table->text('imap_details_video')->nullable();
            $table->text('sending_mails')->nullable();
            $table->text('max_email_per_day')->nullable();
            $table->text('delay_email')->nullable();
            $table->text('open_tracking')->nullable();
            $table->text('complete_on_replay')->nullable();
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
        Schema::dropIfExists('instructions');
    }
};
