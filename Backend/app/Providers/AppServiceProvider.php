<?php

namespace App\Providers;

use App\Models\tenant_db_name;
use App\Repositories\APIUserPlanRepository;
use App\Repositories\Interfaces\APIUserPlanInterface;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     *
     * @return void
     */
    public function register()
    {
        $this->app->bind(APIUserPlanInterface::class, APIUserPlanRepository::class);
    }

    public function boot()
    {
        Schema::defaultStringLength(191);
    }
}
