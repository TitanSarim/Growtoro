<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Mail\SendSmtpMail;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Validator;

class CustomLeadController extends Controller
{
    public function b2b(Request $request): \Illuminate\Http\JsonResponse
    {
        $validator      = Validator::make($request->all(), [
            'company'   => 'required',
            'emails'    => 'required',
            'employee'  => 'required',
            'job'       => 'required',
            'location'  => 'required',
            'revenue'   => 'required'
        ]);

        if ($validator->fails())
        {
            return response()->json([
                'status' => 'error',
                'error' => $validator->errors()
            ], 422);
        }

        try {
            $attribute      = [
                'companies' => $request->company,
                'jobs'      => $request->job,
                'locations' => $request->location,
                'revenues'  => $request->revenue,
                'employees' => $request->employee,
                'emails'    => $request->emails,
                'user'      => auth()->user(),
                'subject'   => 'B2B Custom Lead Request',
                'view'      => 'emails.b2b_request',
            ];
            Mail::to('lists@growtoro.com')->send(new SendSmtpMail($attribute));

            return response()->json([
                'message' => 'Request has been sent successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Something Went Wrong'
            ],403);
        }
    }

    public function b2c(Request $request): \Illuminate\Http\JsonResponse
    {
        $validator      = Validator::make($request->all(), [
            'platform'  => 'required',
            'audiences' => 'required',
            'emails'    => 'required'
        ]);

        if ($validator->fails())
        {
            return response()->json([
                'status' => 'error',
                'error' => $validator->errors()
            ], 422);
        }

        try {
            $attribute      = [
                'platform'  => $request->platform,
                'audiences' => $request->audiences,
                'emails'    => $request->emails,
                'user'      => auth()->user(),
                'subject'   => 'B2C Custom Lead Request',
                'view'      => 'emails.b2c_request',
            ];
            Mail::to('lists@growtoro.com')->send(new SendSmtpMail($attribute));
            return response()->json([
                'message' => 'Request has been sent successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Something Went Wrong'
            ],403);
        }

    }
}
