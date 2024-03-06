<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Faq;
use Illuminate\Http\Request;

class FaqController extends Controller
{
    public function index()
    {

        try {
            $data = [
                'faqs' => Faq::latest()->paginate(15),
            ];
            return view('admin.faq.index', $data);
        } catch (\Exception $e) {
            return back()->with('error','Something Went Wrong');
        }
    }

    public function activeFaqs(): \Illuminate\Http\JsonResponse
    {
        try {
            $data                   = [
                'faqs'              => Faq::where('is_parent', 1)->active()->selectRaw('id,question as title,answer as description')->get(),
                'company_faqs'      => Faq::where('is_parent', 0)->where('type', 'company')->active()->selectRaw('id,question as title,answer as description')->get(),
                'job_faqs'          => Faq::where('is_parent', 0)->where('type', 'job')->active()->selectRaw('id,question as title,answer as description')->get(),
                'location_faqs'     => Faq::where('is_parent', 0)->where('type', 'location')->active()->selectRaw('id,question as title,answer as description')->get(),
                'audiences_faqs'    => Faq::where('is_parent', 0)->where('type', 'audience')->active()->selectRaw('id,question as title,answer as description')->get(),
                'channel_faqs'      => Faq::where('is_parent', 0)->where('type', 'channels')->active()->selectRaw('id,question as title,answer as description')->get(),
                'success'           => 'Faq Retrieved Successfully'
            ];
            return response()->json($data);
        } catch (\Exception $e) {
            return response()->json([
                'error' => $e->getMessage()
            ],403);
        }
    }
    public function create()
    {
        //
    }
    public function store(Request $request): \Illuminate\Http\RedirectResponse
    {
        $request->validate([
            'question'  => 'required',
            'answer'    => 'required',
            'status'    => 'required',
        ]);

        try {
            $data = $request->all();
            $data['is_parent'] = !$request->type;
            Faq::create($data);

            return back()->with('success','Faq Created Successfully');
        } catch (\Exception $e) {
            return back()->with('error',$e->getMessage());
        }
    }
    public function show($id)
    {
        //
    }
    public function edit($id)
    {
        //
    }
    public function update(Request $request): \Illuminate\Http\RedirectResponse
    {
        $request->validate([
            'question'  => 'required',
            'answer'    => 'required',
            'status'    => 'required',
        ]);

        try {
            $id = $request->id;
            $data = $request->all();
            $data['is_parent'] = !$request->type;

            Faq::find($id)->update($data);

            return back()->with('success','Faq Updated Successfully');
        } catch (\Exception $e) {
            return back()->with('error',$e->getMessage());
        }
    }
    public function destroy($id)
    {
        try {
            Faq::destroy($id);
            return back()->with('success', 'Faq Destroyed Successfully');
        } catch (\Exception $e) {
            return back('error',$e->getMessage());
        }
    }
}
