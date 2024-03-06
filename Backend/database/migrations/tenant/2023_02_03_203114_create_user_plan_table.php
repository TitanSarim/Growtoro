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
        Schema::create('user_plan', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->references('id')->on('users')->onDelete('NO ACTION');
            $table->integer('plan_id')->nullable()->default(0);
            $table->timestamp('exp_date')->nullable();
            $table->timestamp('purchase_date')->nullable();
            $table->double('plan_amount')->default(0);
            $table->integer('email_account')->default(0);
            $table->integer('plan_type')->default(0);
            $table->integer('plan_credit')->default(0);
            $table->integer('plan_number_email')->default(0);
            $table->integer('plan_number_users')->default(0);
            $table->integer('custom_credit')->default(0);
            $table->integer('used_credit')->default(0);
            $table->string('stripe_subscription_id')->default(0);
            $table->integer('status')->nullable();
            $table->timestamps();


//            $table->foreign('plan_id')->on('id')->references('plan_id')->onDelete('NO ACTION');

        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('user_plan');
    }
};
