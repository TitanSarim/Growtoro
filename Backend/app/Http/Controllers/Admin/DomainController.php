<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\DomainTracking;
use GuzzleHttp\Client;
use GuzzleHttp\Handler\CurlHandler;
use GuzzleHttp\HandlerStack;
use Illuminate\Http\Request;
use GuzzleHttp\Middleware;

class DomainController extends Controller
{
    public function index()
    {
        $domain = DomainTracking::first();
        return view('admin.domain.domainTracking',compact('domain'));
    }

    public function update(Request $request)
    {
        $request->validate([
            'name' => 'required',
        ]);

        try {
            $customDomain = $request->name;
            $expectedRedirect = 'https://services.growtoro.com/api/campaign-clicked';

            $redirectHistory = [];

            $handlerStack = HandlerStack::create(new CurlHandler());
            $handlerStack->push(Middleware::history($redirectHistory));

            $client = new Client([
                'handler' => $handlerStack,
                'allow_redirects' => false, // Disable automatic redirects
            ]);

            $response = $client->get("https://{$customDomain}/api/campaign-clicked");
            $finalUrl = $response->getHeaderLine('Location');

            if ($finalUrl == $expectedRedirect || $finalUrl == $expectedRedirect.'/') {
                $domain = DomainTracking::find($request->id);
                if (!$domain)
                {
                    DomainTracking::insert([
                        'domain'        => $request->name,
                        'tenant_id'     => 'admin',
                        'created_at'    => now(),
                        'updated_at'    => now(),
                    ]);
                }
                else{
                    $domain->domain = $request->name;
                    $domain->save();
                }

                return back()->with(['message'=> 'Data Updated Successfully','success'=> 1]);
            } else {
                // The custom domain is not set up correctly
                return back()->with(['message'=> 'Domain not setup','success'=> 0]);
            }
        } catch (\Exception $e) {
            dd($e);

            return back()->with(['message'=> $e->getMessage(),'success'=> 0]);
        }


    }

}
