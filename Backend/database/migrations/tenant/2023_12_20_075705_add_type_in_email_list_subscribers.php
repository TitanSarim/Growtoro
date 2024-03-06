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
        Schema::table('email_list_subscribers', function (Blueprint $table) {
            
            $table->enum('type', ['Campaign', 'Custom Lead Order', 'User Uploaded'])->default('Campaign');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('email_list_subscribers', function (Blueprint $table) {
            //
        });
    }
};
