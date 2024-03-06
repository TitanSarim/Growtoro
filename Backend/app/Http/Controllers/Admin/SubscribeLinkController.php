<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\SubscribeLink;
use Illuminate\Http\Request;
use mysql_xdevapi\Exception;

class SubscribeLinkController extends Controller
{
    public function index()
    {
        $unsubscribeLink = SubscribeLink::first();

        return view('admin.unsubscribe.index',compact('unsubscribeLink'));
    }

    public function store(Request $request)
    {
        $request->validate([
            'url' => 'required',
        ]);

        try{

        $unsubscribeLink = SubscribeLink::find($request->id);
        if($unsubscribeLink)
        {
            $unsubscribeLink->url = $request->url;

            $unsubscribeLink->save();
        }
        else{
            SubscribeLink::insert([
                'url'           => $request->url,
                'created_at'    => now(),
                'updated_at'    => now(),
            ]);
        }

        return back()->with(['success'=>'Data Stored Successfully']);
        }
        catch (\Exception $e)
        {
            return back()->with(['error'=>'something went wrong']);
        }


    }
}
