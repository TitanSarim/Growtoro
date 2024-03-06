<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\template_email;
use App\Models\university_content;
use Illuminate\Http\Request;

class UniversityController extends Controller
{
    public function university_content(Request $request)
    {
        $uni_content = university_content::orderBy('id','desc')->paginate(20);
        return response()->json([
            'status' => 'success',
            'message' => 'get university content',
            'university_content' => $uni_content,
        ]);
    }

    public function email_template(Request $request)
    {
        $email_tem = template_email::where('status',1)
            ->orderBy('id','desc')
            ->paginate(20);
        return response()->json([
            'status' => 'success',
            'message' => 'get email template',
            'university_content' => $email_tem,
        ]);
    }
}
