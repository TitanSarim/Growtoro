<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Mail\Mailables\Headers;
use Illuminate\Queue\SerializesModels;

class ReplySMTPEmail extends Mailable
{
    use Queueable, SerializesModels;

    protected $data;
    public function __construct($data)
    {
        $this->data = $data;
    }

    public function build()
    {
        return $this->from($this->data['from'], $this->data['from_name'])
            ->subject($this->data['subject'])
            ->cc($this->data['cc'])
            ->bcc($this->data['bcc'])
            ->to($this->data['to_mail'])
            ->view($this->data['view'],$this->data);
    }

    /*public function headers(): Headers
    {
        return new Headers(
            messageId: $this->data['message_id'],
            references: [$this->data['references']],
            text: [
                'X-Custom-Header' => '1321',
            ],
        );
    }*/
}
