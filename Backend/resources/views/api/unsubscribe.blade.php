<!doctype html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport"
          content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Document</title>
    <style>
        /*------ Base styles ------*/
        body {
            background: #f7f8f9;
            font-family: arial;
            background-color: #FFF9DE;
            text-rendering : optimizeLegibility;
            -webkit-font-smoothing : antialiased;
        }


        .container {
            max-width: 500px;
            height: auto;
            margin: 50px auto;
            padding: 60px;
            padding-bottom: 20px;
            background-color: #fff;
            box-sizing: border-box;
            text-align: center;
            border-radius: 10px;
            box-shadow: 0px 15px 15px -12px rgba(0,0,0,0.09);
        }

        .btn {
            background-color: #F2DD68;
            text-decoration: none;
            padding: 15px 20px;
            font-weight: bold;
            border-radius: 50px;
            color: #fff;
        }

        .btn-light {
            background-color: #eee;
            color: #222;
        }

        .btn:hover{
            opacity: 0.8;
        }

        h2 {
            margin: 0;
            padding: 0;
            color: #444;
        }

        p {
            margin-top: 10px;
            line-height: 24px;
            margin-bottom: 40px;
            color: #888;
        }

        /*------ Main Emoji Styling ------*/

        .emoji {
            box-sizing: border-box;
            margin: 30px auto 20px;
            width: 120px;
            height: 120px;
        }

        .face {
            width: 100px;
            height: 100px;
            position: relative;
            margin: 0 15px 30px 0;
            border-radius: 50%;
            background: #F2DD68;
            transition: 1s;
        }

        .face:after {
            content: '';
            display: block;
            position: absolute;
            width: 100%;
            height: 100%;
            top: -8px;
            left: -8px;
            border-radius: 50%;
            box-shadow: 8px 8px 0 0 rgba(0, 0, 0, 0.07);
        }

        .eye {
            position: absolute;
            width: 14px;
            height: 14px;
            top: 30px;
            left: 18px;
            z-index: 1;
            border-radius: 50%;
            background: #995710;
        }

        .eye:last-child {
            left: auto;
            right: 18px;
        }

        .emoji .eyed {
            animation-name: blink;
            animation-iteration-count: infinite;
            animation-duration: 3s;
        }

        @keyframes blink {
            10% {
                height: 10px;
                top: 32px;
            }
            20% {
                height: 0.5px;
                top: 37px;
            }
            50% {
                height: 10px;
                top: 32px;
            }
        }

        .mouth {
            position: absolute;
            top: 50px;
            left: 0;
            right: 0;
            z-index: 1;
            width: 70px;
            height: 34px;
            margin: 0 auto;
            border-radius: 0 0 70px 70px;
            overflow: hidden;
            background: #995710;
            transition: 0.3s;
        }

        .mouth:before,
        .mouth:after {
            content: '';
            position: absolute;
            display: block;
        }


        /*------ Shocked Emoji Styling ------*/

        .shocked .mouth {
            width: 25px;
            height: 25px;
            border-radius: 50%;
        }


        #cancel:hover ~ .emoji .mouth{
            top: 55px;
            z-index: 1;
            width: 50px;
            height: 25px;
            margin: 0 auto;
            border-radius: 0 0 70px 70px;
            overflow: hidden;
            background: #995710;
        }

        #unsubscribe:hover ~ .emoji .mouth{
            width: 50px;
            height: 5px;
            top: 60px;
            border-radius: 50px;
        }


        .disable_btn{
            pointer-events: none;
            opacity: 0.5;
        }
    </style>
</head>
<body>
@if(session()->has('unsubscribed'))
    <div class="container success_div">
        <p>Already Unsubscribed</p>
    </div>
@else
    <div class="container unsubscribe_div">
        <h2>Oh! You want to unsubscribe?</h2>
        <p>We hate goodbyes, But if you change yor mind, we'll always be here with something fun to share.</p>
        <a href="{{ route("unsubscribe.mail",['tenant_id' => $tenant_id,'subscriber_id' => $subscriber->id]) }}" class="btn" id="unsubscribe">Unsubscribe</a>
    </div>
@endif



</body>
</html>
