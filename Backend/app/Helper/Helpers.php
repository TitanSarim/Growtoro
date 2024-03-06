<?php

if (!function_exists('getUrl'))
{
    function getUrl(): string
    {
        $environment    = config('app.env');
        $url            = 'https://app.growtoro.com';

        if ($environment == 'local')
        {
            $url = 'http://174.129.231.89';
        }

        return $url;
    }
}
if (!function_exists('arrayCheck'))
{
    function arrayCheck($key,$array): string
    {
        return $array && is_array($array) && array_key_exists($key,$array) && !empty($array[$key]) && $array[$key] != 'null';
    }
}
