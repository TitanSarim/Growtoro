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
        Schema::create('email_list_subscribers', function (Blueprint $table) {
            $table->id();
            $table->uuid('subscriber_uid')->unique();
            $table->foreignId('list_id')->constrained('email_lists')->onUpdate('cascade')->onDelete('cascade');
            $table->string('email');
            $table->text('other')->nullable();
            $table->boolean('status')->default(1);
            $table->timestamps();
            $table->index(['email']);
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('email_list_subscribers');
    }
};
