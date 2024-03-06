<?php

namespace App\Http\Controllers\API\Auth;

use App\Http\Controllers\Controller;
use App\Models\Admin;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use Laravel\Passport\ClientRepository;

class AdminLoginController extends Controller
{
    public function admin_login_submit(Request $request)
    {
             $clientRepository = new ClientRepository();

        $client = $clientRepository->createPasswordGrantClient(null, 'adminclient', '');
        $acc = $clientRepository->createPersonalAccessClient(null, 'adminclient', '');


        $validator = Validator::make($request->all(), [
            'email' => 'required|email',
            'password' => 'required|min:8',
        ]);


        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'msg' => $validator->errors()
            ], 400);

            exit();
        }

        $credentials = request(['email', 'password']);

        if (Auth::guard('admin')->attempt($credentials)) {

            $login_user = Auth::guard('admin')->user();

            $user = Admin::where('id', $login_user->id)->first();
            $success['token'] = $user->createToken('srtbillingmanagement')->accessToken;

            $user_details = Admin::where('id', $user->id)->first();

            return response()->json([
                'status' => 'success',
                'message' => 'login successful',
                'access_token' => 'Bearer' . ' ' . $success['token'],
                'token_type' => 'Bearer',
                'user' => $user_details,
            ]);
        } else {
            return response()->json([
                'status' => 'error',
                'message' => 'Invalid credentials, please re-check provided email id and password'
            ], 404);
        }
    }
}
