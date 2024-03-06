<?php

namespace App\Http\Controllers\API\Emails;

use App\Http\Controllers\Controller;
use App\Mail\SendSmtpMail;
use App\Models\Emails\EmailAccount;
use App\Models\tenant_db_name;
use App\Models\user_plan;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;
use Symfony\Component\Mailer\Exception\TransportException;

class EmailAccountController extends Controller
{
    private $smtp_valid_data = [
        'smtp_from_email' => 'required|email',
        'smtp_first_name' => 'required',
        'smtp_last_name' => 'required',
        'smtp_host_name' => 'required',
        'smtp_user_name' => 'required',
        'smtp_password' => 'required',
        'smtp_port' => 'required',
    ];
    private $imap_valid_data = [
        'imap_host_name' => 'required',
        'imap_user_name' => 'required',
        'imap_password' => 'required',
        'imap_port' => 'required',
    ];

    public function index()
    {
        try {
            $data = EmailAccount::withCount('todayEmailSent')->withCount('threads')->latest()->where('user_id', auth()->id())->get();
            $email_list_limit = user_plan::where('status',1)->first()->email_account??50;

            return response()->json([
                'status'        => 'success',
                'message'       => 'Email loaded successfully.',
                'data'          => $data,
                'total_rows'    => count($data),
                'limit'         => $email_list_limit,
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Something Went Wrong',
            ], 403);
        }
    }


    public function store($t_id,Request $request)
    {
        $validator = Validator::make($request->all(), $this->smtp_valid_data + $this->imap_valid_data);

        if ($validator->fails())
        {
            return response()->json([
                'error' => $validator->errors()
            ], 422);
        }

        $email_accounts = EmailAccount::count();
        $plan           = user_plan::where('status',1)->first();
        $email_limit    = 50;
        if ($plan)
        {
            $email_limit = $plan->email_account;
        }

        if ($email_accounts >= $email_limit)
        {
            return response()->json([
                'status'        => 'success',
                'limit_message' => 'Plan email list exceeds',
                'permission'    => 0,
                'email_limit'   => number_format($email_limit),
            ]);
        }

        try {
            $this->imap_test($request->imap_host_name, $request->imap_user_name, $request->imap_password, $request->imap_port);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Unable to verify IMAP settings, Please make sure the credentials are correct'
            ],403);
        }

        try {
            $this->smtp_test($request->smtp_host_name, $request->smtp_from_name, $request->smtp_from_email, $request->smtp_user_name, $request->smtp_password, $request->smtp_port);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Unable to Verify SMTP settings, Please make sure the credentials are correct'
            ],403);
        }
        DB::beginTransaction();
        try {
            $data = [
                'user_id'           => auth()->id(),
                'smtp_from_email'   => $request->smtp_from_email,
                'smtp_first_name'   => $request->smtp_first_name,
                'smtp_last_name'    => $request->smtp_last_name,
                'smtp_from_name'    => $request->smtp_first_name .' '.$request->smtp_last_name,
                'smtp_host_name'    => $request->smtp_host_name,
                'smtp_user_name'    => $request->smtp_user_name,
                'smtp_password'     => $request->smtp_password,
                'smtp_port'         => $request->smtp_port,
                'imap_host_name'    => $request->imap_host_name,
                'imap_user_name'    => $request->imap_user_name,
                'imap_password'     => $request->imap_password,
                'imap_port'         => $request->imap_port
            ];

            $email_account = EmailAccount::create($data);

            $new_attribute      = [
                'email'         => $request->smtp_from_email,
                'subject'       => 'New Email Account Added',
                'view'          => 'emails.email_account',
                'user'          => auth()->user(),
            ];

            $mailer = Str::random(6).'_smtp';
            $stmp               = [
                'transport'     => 'smtp',
                'host'          => env('MAIL_HOST'),
                'port'          => (int)env('MAIL_PORT'),
                'encryption'    => env('MAIL_ENCRYPTION'),
                'username'      => env('MAIL_USERNAME'),
                'password'      => env('MAIL_PASSWORD'),
                'from'          =>
                    [
                        //FIXME TWO BOTTOM LINES MUST BE GIVEN A DO OVER PROBABLY
                        'address'   => env('MAIL_FROM_ADDRESS'),
                        'name'      => env('MAIL_FROM_NAME'),
                    ],
            ];
            config(["mail.mailers.$mailer" => $stmp]);

            Mail::mailer($mailer)->to('warmup@growtoro.com')->send(new SendSmtpMail(array_merge($new_attribute,$data)));

            if ($email_account->id)
            {
                $tenant = tenant_db_name::where('tenant_id',$t_id)->first();
                /*$curl = curl_init();

                $payload = array(
                    "event_name"        => "First email account has been connected by $tenant->tenant_email",
                    "created_at"        => now()->timestamp,
                    "user_id"           => (string)$t_id,
                    "id"                => Str::random(32),
                    "email"             => $tenant->tenant_email,
                    "metadata"          => array(
                        "invite_code"   => $t_id
                    )
                );*/

                $token      = config('services.intercom.token');
                $version    = config('services.intercom.version');
                $curl = curl_init();

                $payload = array(
                    "name"      => "First email account has been connected by $tenant->tenant_email",
                    "model"     => "contact",
                    "data_type" => "Email Account"
                );

                curl_setopt_array($curl, [
                    CURLOPT_HTTPHEADER => [
                        "Authorization: Bearer $token",
                        "Content-Type: application/json",
                        "Intercom-Version: $version"
                    ],
                    CURLOPT_POSTFIELDS => json_encode($payload),
                    CURLOPT_URL => "https://api.intercom.io/data_attributes",
                    CURLOPT_RETURNTRANSFER => true,
                    CURLOPT_CUSTOMREQUEST => "POST",
                ]);
            }

            DB::commit();
            return response()->json([
                'status'    => 'success',
                'message'   => 'Email account created successfully.',
            ], 200);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'error' => 'Something Went Wrong, please try again'
            ],403);
        }
    }


    public function update(Request $request)
    {
        $validator = Validator::make($request->all(), ['id' => 'required|int']+$this->smtp_valid_data + $this->imap_valid_data);

        if ($validator->fails())
        {
            return response()->json([
                'error' => $validator->errors()
            ], 422);
        }

        try {
            $this->imap_test($request->imap_host_name, $request->imap_user_name, $request->imap_password, $request->imap_port);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Unable to verify IMAP settings, Please make sure the credentials are correct'
            ],403);
        }

        try {
            $this->smtp_test($request->smtp_host_name, $request->smtp_from_name, $request->smtp_from_email, $request->smtp_user_name, $request->smtp_password, $request->smtp_port);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Unable to Verify SMTP settings, Please make sure the credentials are correct'
            ],403);
        }

        $emailAccount = EmailAccount::find($request->id);

        if(!$emailAccount)
        {
            return response()->json(['status' => 'error', 'error' => 'Email Account Not found'],403);
        }

        try {
            $emailAccount->update([
                'smtp_from_email'       => $request->smtp_from_email,
                'smtp_first_name'       => $request->smtp_first_name,
                'smtp_last_name'        => $request->smtp_last_name,
                'smtp_from_name'        => $request->smtp_first_name .' '.$request->smtp_last_name,
                'smtp_host_name'        => $request->smtp_host_name,
                'smtp_user_name'        => $request->smtp_user_name,
                'smtp_password'         => $request->smtp_password,
                'smtp_port'             => $request->smtp_port,
                'imap_host_name'        => $request->imap_host_name,
                'imap_user_name'        => $request->imap_user_name,
                'imap_password'         => $request->imap_password,
                'imap_port'             => $request->imap_port,
                "is_connection_failed"  => 0
            ]);
            return response()->json([
                'status' => 'success',
                'message' => 'Email account updated successfully.',
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Something Went Wrong, please try again'
            ],403);
        }
    }


    public function destroy(Request $request)
    {
        $validator = Validator::make($request->all(), ['id' => 'required|int']);
        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => $validator->errors()
            ], 403);
        }

        $emailAccount = EmailAccount::find($request->id);
        if(!$emailAccount) {
            return response()->json(['status' => 'error', 'message' => 'Email Accoutn Not found'], 403);
        }

        $emailAccount->delete();
        return response()->json(['status' => 'success', 'message' => 'Email Accoutn delete successfully.'], 200);
    }

    public function status(Request $request): \Illuminate\Http\JsonResponse
    {
        $validator  = Validator::make($request->all(), [
            'id'    => 'required',
            'value' => 'in:0,1',
        ]);

        if ($validator->fails())
        {
            return response()->json([
                'status'    => 'error',
                'error'     => $validator->errors()
            ], 422);
        }

        try {
            if ($request->type == 'warm_up') {
                if ($request->value == 1) {
                    $msg = 'Warm Up Activated';
                } else {
                    $msg = 'Warm Up Deactivated';
                }
            } else {
                if ($request->value == 1) {
                    $msg = 'Email Account Activated';
                } else {
                    $msg = 'Email Account Deactivated';
                }
            }

            $email_account = EmailAccount::find($request->id);

            /*if ($request->value == 1) {
                $url = 'https://api.instantly.ai/api/v1/account/warmup/enable';
            } else {
                $url = 'https://api.instantly.ai/api/v1/account/warmup/pause';
            }

            $curl = curl_init();

            curl_setopt_array($curl, [
                CURLOPT_URL             => $url,
                CURLOPT_RETURNTRANSFER  => true,
                CURLOPT_ENCODING        => "",
                CURLOPT_MAXREDIRS       => 10,
                CURLOPT_TIMEOUT         => 30,
                CURLOPT_HTTP_VERSION    => CURL_HTTP_VERSION_1_1,
                CURLOPT_CUSTOMREQUEST   => "POST",
                CURLOPT_POSTFIELDS      => "{\n  \"api_key\": \"qe2ekw8e6745baghky7vsea4qfm0\",\n  \"email\": \"$email_account->smtp_from_email\"\n}",
                CURLOPT_HTTPHEADER      => [
                    "Content-Type: application/json"
                ]
            ]);

            $response = curl_exec($curl);
            $err = curl_error($curl);

            curl_close($curl);

            if ($err) {
                return response()->json([
                    'error' => $err
                ],403);
            }*/

            $type = $request->type;
            $email_account->$type = $request->value;
            $email_account->save();

            return response()->json([
                'success'       => $msg,
            ]);
        } catch (\Exception $e)
        {
            return response()->json([
                'error' => 'Something Went Wrong'
            ],403);
        }
    }

    public function imap_test($host, $user, $pass, $port)
    {
        return imap_open("{{$host}:{$port}/imap/ssl/novalidate-cert}INBOX", $user, $pass);
    }

    public function smtp_test($host, $from_name, $from_email, $user, $pass, $port)
    {
        $mailer = Str::random(6).'_smtp';
        $stmp               = [
            'transport'     => 'smtp',
            'host'          => $host,
            'port'          => (int)$port,
            'encryption'    => $port == '465' ? 'ssl' : 'tls',
            'username'      => $user,
            'password'      => $pass,
            'from'          =>
                [
                    //FIXME TWO BOTTOM LINES MUST BE GIVEN A DO OVER PROBABLY
                    'address'   => $from_email,
                    'name'      => $from_name,
                ],
        ];
        config(["mail.mailers.$mailer" => $stmp]);
        $html = '
        <p>This email is just a test to confirm your successful email account connection to the Growtoro platform</p>
        ';

        Mail::mailer('user_stmp')
            ->send([], [], function ($m) use ($user, $from_name, $from_email, $html) {
                $m->to($user)
                    ->from($from_email, $from_name)
                    ->subject('Growtoro Connection TEST')
                    ->html($html);
            });
        return ['status' => 'success', 'message' => 'Email send to your account and verified.'];
    }

}
