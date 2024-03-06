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
        Schema::create('unibox_threads', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('drip_campaign_id');
            $table->string('sender_mail');
            $table->string('recipient_mail');
            $table->string('lead_status')->default('lead');
            $table->boolean('is_deleted')->default(0);
            $table->boolean('status')->default(1);
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
        Schema::dropIfExists('unibox_threads');
    }
};
