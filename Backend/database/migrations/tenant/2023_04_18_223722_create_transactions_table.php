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
		Schema::create('transactions', function (Blueprint $table) {
			$table->id();
			$table->foreignId('user_id')->references('id')->on('users')->onDelete('NO ACTION');
			$table->foreignId('billing_id')->references('id')->on('user_billings')->onDelete('NO ACTION');
			$table->string('transaction_type')->nullable();
			$table->timestamp('transaction_date')->nullable();
			$table->double('transaction_amount', 8, 2)->nullable();
			$table->text('transaction_description')->nullable();
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
		Schema::dropIfExists('transactions');
	}
};
