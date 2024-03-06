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
        Schema::create('email_queue_records', function (Blueprint $table) {
            $table->id();
            $table->integer('drip_id');
            $table->integer('subscriber_id');
            $table->string('tenant_id');
            $table->integer('sequence_id');
            $table->string('timezone')->nullable();
            $table->dateTime('delay')->nullable();
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
        Schema::dropIfExists('email_queue_records');
    }
};
