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
        Schema::create('drip_responds', function (Blueprint $table) {
            $table->id();
            $table->foreignId('reply_id')->constrained('drip_replies')->onUpdate('cascade')->onDelete('cascade');
            $table->string('from_name')->nullable();
            $table->string('from_email')->nullable();
            $table->text('email_body')->nullable();
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
        Schema::dropIfExists('drip_responds');
    }
};
