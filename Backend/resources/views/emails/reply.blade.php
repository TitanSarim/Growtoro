<html
    lang="en"
    class="dj_webkit dj_chrome dj_contentbox"
    data-darkreader-mode="dynamic"
    data-darkreader-scheme="dark"
>

<head>
    <meta charset="UTF-8">
    <meta name="viewport"
          content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Document</title>
    <link rel="stylesheet" href="{{ asset('assets/dashboard/dist/css/bootstrap.min.css') }}">
    <style>
        body, p, h1, h2, h3, h4, h5, h6, span {
            line-height: 1.5 !important;
            line-break: anywhere !important;
            padding: 0 !important;
            margin: 0 !important;
        }
        @media not all and (min-resolution: .001dpcm) {
            @supports (-webkit-appearance: none)  {
                .padding_body{
                    padding-right: 7px;
                    padding-left: 7px;
                }
            }
        }
    </style>
</head>
<body>

<div class="container">
    <div class="padding_body">
        {!! $body !!}
    </div>
</div>
</body>
</html>
