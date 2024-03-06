@extends('layouts.admin')
@section('admin')
    <div class="container-fluid">
        <div class="row">

            <div class="col-md-12">

                <div class="card card-primary">
                    <div class="card-header">
                        <h3 class="card-title">Custom Order</h3>
                    </div>


                    <form action="{{route('admin.user.save')}}" method="post">
                        @csrf
                        <div class="card-body">
                            <div class="row">

                                <div class="col-md-4">
                                    <div class="form-group">
                                        <label for="exampleInputEmail1">Name</label>
                                        <input type="text" class="form-control" name="name">
                                    </div>
                                </div>
                                <div class="col-md-4">
                                    <div class="form-group">
                                        <label for="exampleInputEmail1">Email</label>
                                        <input type="email" class="form-control" name="email">
                                    </div>
                                </div>
                                <div class="col-md-4">
                                    <div class="form-group">
                                        <label for="exampleInputEmail1">Password</label>
                                        <input type="password" class="form-control" name="password">
                                    </div>
                                </div>


                            </div>

                        </div>

                        <div class="card-footer">
                            <button type="submit" class="btn btn-primary">Submit</button>
                        </div>
                    </form>
                </div>


            </div>


        </div>

    </div>




    <div class="row">
        <div class="col-12">
            <div class="card">
                <div class="card-header">
                    <h3 class="card-title">All Users</h3>
                    <div class="card-tools">
                        <div class="input-group input-group-sm" style="width: 150px;">
                            <input type="text" name="table_search" class="form-control float-right"
                                   placeholder="Search">
                            <div class="input-group-append">
                                <button type="submit" class="btn btn-default">
                                    <i class="fas fa-search"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="card-body table-responsive p-0" style="height: 300px;">
                    <table class="table table-head-fixed text-nowrap">
                        <thead>
                        <tr>
                            <th> ID</th>
                            <th> Name</th>
                            <th> Email</th>
                            <th>Created Date</th>
                            <th>Action</th>
                        </tr>
                        </thead>
                        <tbody>
{{--                        @foreach($all_users_ten as $user)--}}
{{--                            <tr>--}}
{{--                                <td>{{$user['tenant_id']}}</td>--}}
{{--                                <td>{{$user['name']}}</td>--}}
{{--                                <td>{{$user['email']}}</td>--}}
{{--                                <td>{{\Carbon\Carbon::parse($user['created_date'])->format('Y-m-d')}}</td>--}}
{{--                                <td>--}}
{{--                                    <a href="{{route('admin.view.tenant',$user['id'])}}">--}}
{{--                                        <button class="btn btn-success btn-sm"><i class="fas fa-eye"></i></button>--}}
{{--                                    </a>--}}

{{--                                </td>--}}

{{--                            </tr>--}}

{{--                        @endforeach--}}

                        </tbody>
                    </table>
                </div>
                {{--                {{$all_users->links()}}--}}
            </div>

        </div>
    </div>

@endsection
