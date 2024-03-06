<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('db_connection_lists', function (Blueprint $table) {
            $table->id();
            $table->string('db_name')->nullable();
            $table->string('db_host')->nullable();
            $table->string('db_port')->nullable();
            $table->integer('connection_count')->nullable();
            $table->integer('connection_limit')->nullable();
            $table->integer('is_use')->nullable();
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
        Schema::dropIfExists('db_connection_lists');
    }
};
