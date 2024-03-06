<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use App\Models\Admin;
use App\Models\db_connection_list;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     *
     * @return void
     */
    public function run()
    {
        // \App\Models\User::factory(10)->create();

        // \App\Models\User::factory()->create([
        //     'name' => 'Test User',
        //     'email' => 'test@example.com',
        // ]);


        $admin = new Admin();
        $admin->name = "admin";
        $admin->email = "admin@admin.com";
        $admin->password = Hash::make('12345678');
        $admin->save();

        $db_con_one = new db_connection_list();
        $db_con_one->db_name = "server_one";
        $db_con_one->db_host = "127.0.0.1";
        $db_con_one->db_port = "3306";
        $db_con_one->connection_count = 0;
        $db_con_one->connection_limit = 10;
        $db_con_one->is_use = 0;
        $db_con_one->save();

        $db_con_one = new db_connection_list();
        $db_con_one->db_name = "server_two";
        $db_con_one->db_host = "127.0.0.1";
        $db_con_one->db_port = "3306";
        $db_con_one->connection_count = 0;
        $db_con_one->connection_limit = 10;
        $db_con_one->is_use = 0;
        $db_con_one->save();






    }
}
