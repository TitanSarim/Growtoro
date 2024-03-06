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
        Schema::create('drip_emails', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('email_account_id');
            $table->unsignedBigInteger('subscriber_id');
            $table->unsignedBigInteger('list_id')->comment('take as campaign id');
            $table->string('subscriber_email');
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
        Schema::dropIfExists('drip_emails');
    }
};
