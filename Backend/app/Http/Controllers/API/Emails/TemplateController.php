<?php

namespace App\Http\Controllers\API\Emails;

use App\Http\Controllers\Controller;
use App\Http\Resources\TemplateResource;
use App\Models\DeletedTemplate;
use App\Models\template_email;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class TemplateController extends Controller
{
    public function index($tenant_id,Request $request): \Illuminate\Http\JsonResponse
    {
        try {
            $paginate = $request->page_size ?: 12;
            $data = template_email::when($request->tag && $request->tag != "null" && $request->tag != "all",function ($query) use ($request){
                $query->whereJsonContains('tags',(string)$request->tag);
            })->where(function ($query) use ($tenant_id){
                $query->where('tenant_id',$tenant_id)->orWhere('tenant_id','admin');
            })->whereDoesntHave('deletedTemplates',function ($query) use ($tenant_id){
                $query->where('tenant_id',$tenant_id);
            })->latest()->paginate($paginate);

            $tags = template_email::where('tags','!=','null')->where(function ($query) use ($tenant_id){
                $query->where('tenant_id',$tenant_id)->orWhere('tenant_id','admin');
            })->whereDoesntHave('deletedTemplates',function ($query) use ($tenant_id){
                $query->where('tenant_id',$tenant_id);
            })->get();

            $tagStack = [];

            foreach ($tags as $template)
            {
                $array = json_decode($template->tags,true);
                foreach ($array as $tag)
                {
                    $tagStack[] = $tag;
                }
            }

            return response()->json([
                'status'        => 'success',
                'message'       => 'Template loaded successfully.',
                'data'          => TemplateResource::collection($data),
                'tags'          => array_values(array_unique($tagStack)),
                'total_rows'    => $data->total()
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'error' => $e->getMessage()
            ],403);
        }
    }

    public function store($tenant_id,Request $request): \Illuminate\Http\JsonResponse
    {
        $validator = Validator::make($request->all(), ['body' => 'required']);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => $validator->errors()
            ], 422);
        }
        try {
            template_email::create([
                'subject'       => $request->subject,
                'name'          => $request->name,
                'description'   => $request->body,
                'tags'          => json_encode($request->tags),
                'tenant_id'     => $tenant_id,
            ]);
            return response()->json([
                'status' => 'success',
                'message' => 'Template created successfully.',
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Something Went Wrong',
            ], 403);
        }

    }

    public function update(Request $request): \Illuminate\Http\JsonResponse
    {
        $validator = Validator::make($request->all(), ['id' => 'required|int', 'body' => 'required']);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => $validator->errors()
            ], 403);
        }

        try {
            $template = template_email::find($request->id);
            if (!$template) {
                return response()->json(['status' => 'error', 'message' => 'Template Not found'], 422);
            }
            $template->update([
                'subject'       => $request->subject,
                'name'          => $request->name,
                'description'   => $request->body,
                'tags'          => json_encode($request->tags),
            ]);
            return response()->json([
                'status' => 'success',
                'message' => 'Template updated successfully.',
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Something Went Wrong',
            ], 403);
        }
    }


    public function destroy($tenant_id,Request $request): \Illuminate\Http\JsonResponse
    {
        $validator = Validator::make($request->all(), ['id' => 'required|int']);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => $validator->errors()
            ], 403);
        }

        try {
            $template = template_email::find($request->id);
            if ($template->tenant_id == $tenant_id) {
                $template->delete();
            } else {
                DeletedTemplate::create([
                    'tenant_id' => $tenant_id,
                    'template_email_id' => $template->id,
                ]);
            }
            return response()->json([
                'status' => 'success',
                'message' => 'Template delete successfully.',
                'tenant_id' => $tenant_id
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'error' => $e->getMessage()
            ]);
        }
    }
}
