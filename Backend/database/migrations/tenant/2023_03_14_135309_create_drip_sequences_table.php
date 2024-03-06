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
        Schema::create('drip_sequences', function (Blueprint $table) {
            $table->id();
            $table->uuid('sq_uid')->unique();
            $table->foreignId('drip_id')->constrained('drip_campaigns')->onUpdate('cascade')->onDelete('cascade');
            $table->string('wait_time')->nullable();
            $table->string('sq_subject', 500)->nullable();
            $table->longText('sq_body')->nullable();
            $table->date('start_date')->nullable();
            $table->date('end_date')->nullable();
            $table->string('sq_id')->nullable();
            $table->string('log_file')->nullable();
            $table->string('offset', 20)->default(0);
            $table->string('total', 20)->default(0);
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
        Schema::dropIfExists('drip_sequences');
    }
};
