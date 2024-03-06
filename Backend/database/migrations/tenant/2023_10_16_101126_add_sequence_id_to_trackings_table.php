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
        Schema::table('drip_clicks', function (Blueprint $table) {
            $table->unsignedBigInteger('sequence_id')->after('drip_id');
        });
        Schema::table('drip_emails', function (Blueprint $table) {
            $table->unsignedBigInteger('sequence_id')->after('list_id');
        });
        Schema::table('drip_opens', function (Blueprint $table) {
            $table->unsignedBigInteger('sequence_id')->after('drip_id');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('trackings', function (Blueprint $table) {
            //
        });
    }
};
