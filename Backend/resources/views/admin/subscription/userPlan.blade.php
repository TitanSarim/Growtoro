@extends('layouts.admin')
@section('admin')

    <div class="content-header">
        <div class="container-fluid">
            <div class="row mb-2">
                <div class="col-sm-6">
                    <h1 class="m-0">User Plan</h1>
                </div><!-- /.col -->
                <div class="col-sm-6">
                    <ol class="breadcrumb float-sm-right">

                    </ol>
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
                            <th>User Name</th>
                            <th>Plan Name</th>
                            <th>Plan Amount</th>
                            <th>Plan Type</th>
                            <th>Status</th>
                            <th>Created Date</th>
                            <th>Action</th>
                        </tr>
                        </thead>
                        <tbody>
                        @foreach($user_plans as $plan)
                            @if($plan)
                                <tr>
                                    <td>{{$plan['name']}}</td>
                                    <td>{{$plan['email']}}</td>
                                    <td>${{number_format($plan['plan_amount'],2)}}</td>
                                    <td>
                                        @if($plan['plan_type'] == 1)
                                            Subscription
                                        @elseif($plan['plan_type'] == 2)
                                            Credit
                                        @else
                                            Not Set
                                        @endif
                                    </td>
                                    <td>
                                        @if($plan['status'] == 0)
                                            Active
                                        @elseif($plan['status'] == 1)
                                            InActive
                                        @else
                                            Not Set
                                        @endif
                                    </td>
                                    <td>{{\Carbon\Carbon::parse($plan['purchase_date'])->format('Y-m-d')}}</td>
                                    <td>
                                        <button class="btn btn-primary btn-sm" data-toggle="modal"
                                                data-target="#editplan{{$plan['id']}}"><i class="fas fa-edit"></i>
                                        </button>

                                    </td>
                                </tr>
                                <div class="modal fade" id="editplan{{$plan['id']}}" tabindex="-1" role="dialog"
                                     aria-labelledby="exampleModalLabel" aria-hidden="true">
                                    <div class="modal-dialog modal-dialog-centered" role="document">
                                        <div class="modal-content">
                                            <div class="modal-header">
                                                <h5 class="modal-title" id="exampleModalLabel">Update Plan</h5>
                                                <button type="button" class="close" data-dismiss="modal"
                                                        aria-label="Close">
                                                    <span aria-hidden="true">&times;</span>
                                                </button>
                                            </div>
                                            <form action="{{route('admin.user.plan.update')}}" method="post">
                                                @csrf
                                                <div class="modal-body">
                                                    <div class="col-md-12">
                                                        <label>Plan Status</label>
                                                        <select class="form-control" name="plan_status">
                                                            <option value="">select any</option>
                                                            <option value="0" {{$plan['status'] == 0 ?'selected' : ''}}>
                                                                Active
                                                            </option>
                                                            <option value="1" {{$plan['status'] == 1 ?'selected' : ''}}>
                                                                Inactive
                                                            </option>
                                                        </select>
                                                        <input type="hidden" name="user_plan_id"
                                                               value="{{$plan['id']}}">
                                                    </div>
                                                </div>
                                                <div class="modal-footer">
                                                    <button type="button" class="btn btn-secondary"
                                                            data-dismiss="modal">Close
                                                    </button>
                                                    <button type="submit" class="btn btn-primary">Save</button>
                                                </div>
                                            </form>
                                        </div>
                                    </div>
                                </div>
                            @endif
                        @endforeach

                        </tbody>
                    </table>
                </div>

            </div>

        </div>
    </div>

@endsection
