<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Mail\Mailables\Headers;
use Illuminate\Queue\SerializesModels;

class MyTrackedEmail extends Mailable
{
    use Queueable, SerializesModels;

    protected $data;

    public function __construct($data)
    {
        $this->data = $data;
    }

    public function build()
    {
        return $this->from($this->data['from_mail'], $this->data['from_name'])
            ->to($this->data['to_mail'], $this->data['to_name'])
            ->subject($this->data['subject'])
            ->view($this->data['view'],$this->data);
    }

    public function headers(): Headers
    {
        return new Headers(
            messageId: $this->data['message_id'],
            references: array_key_exists('references',$this->data) && count($this->data['references']) > 0 ? $this->data['references'] : [$this->data['campaign']->dirp_uid],
            text: [
                'X-Custom-Header' => $this->data['campaign']->dirp_uid,
            ],
        );
    }

    public function setTracking()
    {
    }
}
