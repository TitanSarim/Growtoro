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
	public function up ()
	{
		Schema::create('user_billings', function (Blueprint $table) {
			$table->id();
			$table->foreignId('user_id')->references('id')->on('users')->onDelete('NO ACTION');
			$table->integer('plan_id')->nullable();
			$table->integer('plan_type')->nullable();
			$table->date('next_due_date')->nullable();
			$table->integer('credit_balance')->nullable();
			$table->timestamps();
		});
	}

	/**
	 * Reverse the migrations.
	 *
	 * @return void
	 */
	public function down ()
	{
		Schema::dropIfExists('user_billings');
	}
};
