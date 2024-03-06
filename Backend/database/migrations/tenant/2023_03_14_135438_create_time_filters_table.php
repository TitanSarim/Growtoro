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
        Schema::create('time_filters', function (Blueprint $table) {
            $table->id();
            $table->foreignId('drip_id')->constrained('drip_campaigns')->onUpdate('cascade')->onDelete('cascade');
            $table->string('days')->nullable();
            $table->date('start_date')->nullable();
            $table->string('start_at')->nullable();
            $table->string('stop_at')->nullable();
            $table->string('time_zone')->nullable();
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
        Schema::dropIfExists('time_filters');
    }
};
