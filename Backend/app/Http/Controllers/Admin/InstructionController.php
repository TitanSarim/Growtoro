<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Instruction;
use Illuminate\Http\Request;

class InstructionController extends Controller
{

    public function index()
    {
        $instruction = Instruction::first();
        return view('admin.instruction.index',compact('instruction'));
    }

    public function store(Request $request)
    {
        $instruction = Instruction::first();

        $instruction->smtp_details = $request->smtp_details;
        $instruction->smtp_details_video = $request->smtp_details_video;
        $instruction->imap_details = $request->imap_details;
        $instruction->imap_details_video = $request->imap_details_video;
        $instruction->sending_mails = $request->sending_mails;
        $instruction->max_email_per_day = $request->max_email_per_day;
        $instruction->delay_email = $request->delay_email;
        $instruction->complete_on_replay = $request->complete_on_replay;

        $instruction->save();

        return redirect()->back();
    }
}
