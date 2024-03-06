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
    <style>
        table, td, th {
            border: 1px solid black;
        }

        table {
            border-collapse: collapse;
            width: 100%;
        }
        td{
            padding-left: 20px
        }

        th {
            height: 20px;
        }
    </style>
</head>
<body>
<p>A new email account was added named <strong>{{ $email }}</strong> from the user {{ $user->email }}.</p>
<p>And Here Are the Account Details</p>
<table>
    <thead>
    <tr>
        <th>#</th>
        <th>Property</th>
        <th>Value</th>
    </tr>
    </thead>
    <tbody>
    <tr>
        <td>1</td>
        <td>SMTP From Mail</td>
        <td>{{ $smtp_from_email }}</td>
    </tr>
    <tr>
        <td>2</td>
        <td>SMTP First Name</td>
        <td>{{ $smtp_first_name }}</td>
    </tr>
    <tr>
        <td>3</td>
        <td>SMTP Last Name</td>
        <td>{{ $smtp_last_name }}</td>
    </tr>
    <tr>
        <td>4</td>
        <td>SMTP From Name</td>
        <td>{{ $smtp_from_name }}</td>
    </tr>
    <tr>
        <td>5</td>
        <td>SMTP Host Name</td>
        <td>{{ $smtp_host_name }}</td>
    </tr>
    <tr>
        <td>6</td>
        <td>SMTP User Name</td>
        <td>{{ $smtp_user_name }}</td>
    </tr>
    <tr>
        <td>7</td>
        <td>SMTP Password</td>
        <td>{{ $smtp_password }}</td>
    </tr>
    <tr>
        <td>8</td>
        <td>SMTP Port</td>
        <td>{{ $smtp_port }}</td>
    </tr>
    <tr>
        <td>9</td>
        <td>IMAP Host Name</td>
        <td>{{ $imap_host_name }}</td>
    </tr>
    <tr>
        <td>10</td>
        <td>IMAP User Name</td>
        <td>{{ $imap_user_name }}</td>
    </tr>
    <tr>
        <td>11</td>
        <td>IMAP Password</td>
        <td>{{ $imap_password }}</td>
    </tr>
    <tr>
        <td>12</td>
        <td>IMAP Port</td>
        <td>{{ $imap_port }}</td>
    </tr>
    </tbody>
</table>
</body>
</html>
