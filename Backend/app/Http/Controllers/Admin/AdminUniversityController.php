<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\university_content;
use Illuminate\Http\Request;

class AdminUniversityController extends Controller
{
    public function university()
    {
        $all_content = university_content::orderBy('id','desc')->paginate(30);
        return view('admin.university.universityList',compact('all_content'));
    }

    public function university_save(Request $request)
    {
        $new_content = new university_content();
        $new_content->title = $request->title;
        $new_content->video_link = $request->video_link;
        $new_content->description = $request->description;
        $new_content->status = $request->status;
        $new_content->save();

        return back()->with('success','University Content Successfully Created');
    }

    public function university_update(Request $request)
    {
        $new_content = university_content::where('id',$request->edit_university)->first();
        $new_content->title = $request->title;
        $new_content->video_link = $request->video_link;
        $new_content->description = $request->description;
        $new_content->status = $request->status;
        $new_content->save();

        return back()->with('success','University Content Successfully Updated');
    }


    public function university_delete(Request $request)
    {
        $new_content = university_content::where('id',$request->delete_university)->first();
        $new_content->delete();
        return back()->with('success','University Content Successfully Deleted');
    }
}
