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
        Schema::create('email_accounts', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onUpdate('cascade')->onDelete('cascade');
            $table->string('smtp_from_email');
            $table->string('smtp_from_name');
            $table->string('smtp_host_name');
            $table->string('smtp_user_name');
            $table->string('smtp_password');
            $table->string('smtp_port');
            $table->string('imap_host_name');
            $table->string('imap_user_name');
            $table->string('imap_password');
            $table->string('imap_port');
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
        Schema::dropIfExists('email_accounts');
    }
};
