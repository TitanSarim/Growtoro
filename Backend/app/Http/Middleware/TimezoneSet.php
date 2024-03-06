<?php

namespace App\Http\Middleware;

use App\Models\tenant_db_name;
use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class TimezoneSet
{
    public function handle(Request $request, Closure $next)
    {
        $string = url()->current();
        ini_set('upload_max_filesize', '64M');
        ini_set('post_max_size', '64M');
        if (!str_contains($string, 'tenant'))
        {
            $exploded_url = explode('/',$string);

            if (array_key_exists(6,$exploded_url))
            {
                $tenant_id = $exploded_url[6];

                $tenant_db = tenant_db_name::where('tenant_id',$tenant_id)->first();

                if ($tenant_db)
                {
                    $table      = "$tenant_db->tenant_db.users";

                    $user = DB::table($table)->first();

                    if ($user)
                    {
                        $time_zone = $user->time_zone;

                        if ($time_zone)
                        {
                            try {
                                date_default_timezone_set($time_zone);
                            }
                            catch (\Exception $e){

                            }

                        }
                    }
                }
            }
        }
        return $next($request);
    }
}
