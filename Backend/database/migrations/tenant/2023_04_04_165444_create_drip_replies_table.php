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
        Schema::create('drip_replies', function (Blueprint $table) {
            $table->id();
            $table->foreignId('drip_id')->constrained('drip_campaigns')->onUpdate('cascade')->onDelete('cascade');
            $table->unsignedBigInteger('unibox_thread_id');
            $table->text('to_mail')->nullable();
            $table->text('cc')->nullable();
            $table->text('bcc')->nullable();
            $table->string('email')->comment('recipient')->nullable();
            $table->string('subject')->nullable();
            $table->text('body')->nullable();
            $table->string('lead_status')->default('lead');
            $table->integer('ordering')->default(0);
            $table->string('email_msgno')->nullable();
            $table->string('email_uid')->nullable();
            $table->string('message_id')->nullable();
            $table->string('refs')->nullable();
            $table->string('in_reply_to')->nullable();
            $table->integer('follow_up_days')->default(0);
            $table->boolean('status')->default(0);
            $table->boolean('is_deleted')->default(0);
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
        Schema::dropIfExists('drip_replies');
    }
};
