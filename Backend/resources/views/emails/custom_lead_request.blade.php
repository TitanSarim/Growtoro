<!doctype html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport"
          content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <link rel="stylesheet" href="{{ asset('assets/dashboard/dist/css/bootstrap.min.css') }}">
    <title>Document</title>
</head>
<body>
<div class="content">
    <div class="row">
        <div class="col-md-12">
            @php
            $names = explode(' ',$user->name);
            @endphp
            <p>Hi <strong>{{ $names[0] }}</strong>,</p>
            <p>Your list has been completed and uploaded into your platform.</p>
            <p>Best,</p>
            <p>Growtoro List Team</p>
        </div>
    </div>
</div>
</body>
</html>
