@extends('layouts.user')
@section('user')

    <div class="content-header">
        <div class="container-fluid">
            <div class="row mb-2">
                <div class="col-sm-6">
                    <h1 class="m-0">Email Template</h1>
                </div><!-- /.col -->
                <div class="col-sm-6">

                </div><!-- /.col -->
            </div><!-- /.row -->
        </div><!-- /.container-fluid -->
    </div>

    <div class="row">
        <div class="col-12">
            <div class="card">
                <div class="card-header">
                    <h3 class="card-title">Fixed Header Table</h3>
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
                            <th>Email Name</th>
                            <th>Email Address</th>
                            <th>Email City</th>
                            <th>Email Zip</th>
                            <th>Action</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr>
                            <td>demo name</td>
                            <td>demo address</td>
                            <td>demo city</td>
                            <td>demo zip</td>
                            <td>
                                <a href="{{route('user.email.download.save',1)}}">
                                    <button class="btn btn-success btn-sm"><i class="fas fa-download"></i></button>
                                </a>
                            </td>
                        </tr>

                        </tbody>
                    </table>
                </div>

            </div>

        </div>
    </div>

@endsection
