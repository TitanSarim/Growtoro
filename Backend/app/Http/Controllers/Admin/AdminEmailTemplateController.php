<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\template_email;
use Illuminate\Http\Request;

class AdminEmailTemplateController extends Controller
{
    public function email_template()
    {
        $email_lits = template_email::where('tenant_id','admin')->latest()->paginate(15);
        return view('admin.template.emailTemplate',compact('email_lits'));
    }


    public function email_template_save(Request $request)
    {
        $new_tem = new template_email();

        $new_tem->subject = $request->subject;
        $new_tem->description = $request->description;
        $new_tem->tags = json_encode($request->tags);
        $new_tem->status = $request->status;
        $new_tem->save();

        return back()->with('success', 'Email Template successfully Created');
    }

    public function email_template_update(Request $request)
    {
        $new_tem = template_email::where('id',$request->edit_tem)->first();
        $new_tem->subject = $request->subject;
        $new_tem->description = $request->description;
        $new_tem->tags = json_encode($request->tags);
        $new_tem->status = $request->status;
        $new_tem->save();

        return back()->with('success', 'Email Template successfully Updated');
    }

    public function email_template_delete(Request $request)
    {
        $new_tem = template_email::where('id',$request->delete_tem)->first();
        $new_tem->delete();
        return back()->with('success', 'Email Template successfully Deleted');
    }

}
