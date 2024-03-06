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
        Schema::create('all_plans', function (Blueprint $table) {
            $table->id();
            $table->string('plan_name')->nullable();
            $table->double('plan_amount')->nullable();
            $table->double('plan_credit')->nullable();
            $table->text('plan_description')->nullable();
            $table->integer('exp_date')->nullable();
            $table->integer('plan_type')->nullable();
            $table->integer('plan_status')->nullable();
            $table->integer('plan_number_email')->nullable();
            $table->integer('plan_number_users')->nullable();
            $table->string('plan_recurrence')->nullable();
            $table->double('plan_overage')->nullable();
            $table->integer('plan_trial_days')->nullable();
            $table->integer('custom_credit')->nullable();
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
//        \Illuminate\Support\Facades\DB::statement('SET FOREIGN_KEY_CHECKS = 0');
        Schema::dropIfExists('all_plans');
//        \Illuminate\Support\Facades\DB::statement('SET FOREIGN_KEY_CHECKS = 1');
    }
};
