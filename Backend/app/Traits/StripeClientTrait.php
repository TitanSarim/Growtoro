<?php

namespace App\Traits;

trait StripeClientTrait
{

    protected function makeRequest($method,$url,$data = [])
    {
        $headers = [
            'Authorization' => 'Bearer  '.env('STRIPE_SECRET_KEY')
        ];

        $client = new \GuzzleHttp\Client(['verify' => false]);
        $response = $client->request($method, $url, [
            'headers' => $headers,
            'form_params' => $data
        ]);

        $result = $response->getBody()->getContents();

        return json_decode($result,true);
    }
}
