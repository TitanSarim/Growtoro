<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Http\Resources\BlockListResource;
use App\Models\BlockList;
use Illuminate\Http\Request;
use App\Models\Emails\EmailListSubscriber;


class BlockListController extends Controller
{
    public function index(Request $request)
    {
        try {
            $paginate = $request->page_size > 0 ? (int)$request->page_size : 12;

            $data = BlockList::where('status',1)->when($request->q,function ($query) use($request){
                $query->where('email','LIKE','%'.$request->q.'%');
            })->latest()->paginate($paginate);

            return response()->json([
                'status'        => 'success',
                'message'       => 'Block List Fetched successfully.',
                'data'          => BlockListResource::collection($data),
                'total_rows'    => $data->total()
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Something Went Wrong'
            ],403);
        }
    }

    public function store(Request $request)
    {
        try {
            // echo "waleed";die();
            $emails = [];
            $requested_emails = is_string($request->emails) ? json_decode($request->emails,true) : $request->emails;

            // Check if the email is present in email than donot import
            $existing_emails =  EmailListSubscriber::whereIn('email',$requested_emails)->pluck('email')->toArray();

            $filter_emails = array_diff($requested_emails, $existing_emails);



            foreach ($filter_emails as $email) {
                $emails[]           = [
                    'email'         => $email,
                    'status'        => 1,
                    'created_at'    => now(),
                    'updated_at'    => now(),
                ];
            }
            $chunks = array_chunk($emails, 6000);

            if(!empty($chunks)){

                foreach ($chunks as $key => $chunk) {

                    BlockList::insert($chunk);
                }

                return response()->json([
                    'message'   => count($filter_emails). ' email imported successfully',
                ]);
            }
            elseif(!empty($requested_emails)){
                return response()->json([
                    'message'   => ' All emails are used by campaigns',
                ]);   
            }
            else{
                return response()->json(['error' => "Email can't be empty"], 403);
            }
           
        } catch (\Exception $e) {
            return response()->json([
                'error'     => 'Something Went Wrong'
            ],403);
        }
    }

    public function destroy(Request $request): \Illuminate\Http\JsonResponse
    {
        try {
            if (is_array($request->id)) {
                $ids = $request->id;
            } else {
                $ids = [$request->id];
            }

            BlockList::destroy($ids);

            return response()->json(['status' => 'success', 'message' => 'Block List deleted successfully.'], 200);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Something Went Wrong'
            ],403);
        }
    }

}
