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

        th {
            height: 20px;
        }
    </style>
</head>
<body>
<div>
    <p>A B2B Request has been sent from {{ $user->email }} </p>
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
            <td style="padding-left: 20px">1</td>
            <td style="padding-left: 20px">Companies</td>
            <td>
                <ul>
                    @foreach($companies as $company)
                        <li>{{ $company }}</li>
                    @endforeach
                </ul>
            </td>
        </tr>
        <tr>
            <td style="padding-left: 20px">2</td>
            <td style="padding-left: 20px">Job Titles</td>
            <td>
                <ul>
                    @foreach($jobs as $job)
                        <li>{{ $job }}</li>
                    @endforeach
                </ul>
            </td>
        </tr>
        <tr>
            <td style="padding-left: 20px">3</td>
            <td style="padding-left: 20px">Locations</td>
            <td>
                <ul>
                    @foreach($locations as $location)
                        <li>{{ $location }}</li>
                    @endforeach
                </ul>
            </td>
        </tr>
        <tr>
            <td style="padding-left: 20px">4</td>
            <td style="padding-left: 20px">Company Size (Revenue)</td>
            <td>
                <ul>
                    <li>Min (MM) : {{ $revenues[0] }}</li>
                    <li>Max (MM) : {{ $revenues[1] }}</li>
                </ul>
            </td>
        </tr>
        <tr>
            <td style="padding-left: 20px">5</td>
            <td style="padding-left: 20px">Company Size (Employees)</td>
            <td>
                <ul>
                    @foreach($employees as $employee)
                        <li>{{ $employee }}</li>
                    @endforeach
                </ul>
            </td>
        </tr>
        <tr>
            <td style="padding-left: 20px">6</td>
            <td style="padding-left: 20px">Number of Emails</td>
            <td>
                <ul>
                    <li>{{ $emails }}</li>
                </ul>
            </td>
        </tr>
        </tbody>
    </table>
</div>
</body>
</html>
