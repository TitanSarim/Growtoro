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
        Schema::create('drip_sq_opens', function (Blueprint $table) {
            $table->id();
            $table->foreignId('sq_id')->constrained('drip_sequences')->onUpdate('cascade')->onDelete('cascade');
            $table->foreignId('subscriber_id')->constrained('email_list_subscribers')->onUpdate('cascade')->onDelete('cascade');
            $table->tinyInteger('count')->default(0);
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
        Schema::dropIfExists('drip_sq_opens');
    }
};
