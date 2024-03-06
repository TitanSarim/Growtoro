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
        Schema::create('reply_emails', function (Blueprint $table) {
            $table->id();
            $table->foreignId('drip_reply_id')->constrained('drip_replies')->onDelete('cascade');
            $table->unsignedBigInteger('smtp_id');
            $table->text('to_mail')->nullable();
            $table->text('cc')->nullable();
            $table->text('bcc')->nullable();
            $table->string('subject')->nullable();
            $table->text('body')->nullable();
            $table->string('lead_status')->default('lead');
            $table->integer('ordering')->default(0);
            $table->integer('follow_up_days')->default(0);
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
        Schema::dropIfExists('reply_emails');
    }
};
