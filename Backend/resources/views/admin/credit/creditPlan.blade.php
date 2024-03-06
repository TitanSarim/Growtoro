@extends('layouts.admin')
@section('admin')

    <div class="content-header">
        <div class="container-fluid">
            <div class="row mb-2">
                <div class="col-sm-6">
                    <h1 class="m-0">Subscription Plan</h1>
                </div><!-- /.col -->
                <div class="col-sm-6">
                    <ol class="breadcrumb float-sm-right">
                        <button class="btn btn-success btn-sm" data-toggle="modal" data-target="#exampleModal">Create
                            New Plan
                        </button>
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
                            <th>Plan Name</th>
                            <th>Plan Amount</th>
                            <th>Plan Credit</th>
                            <th>Status</th>
                            <th>Created Date</th>
                            <th>Action</th>
                        </tr>
                        </thead>
                        <tbody>
                        @foreach($all_plans as $plan)
                            <tr>
                                <td>{{$plan->plan_name}}</td>
                                <td>${{number_format($plan->plan_amount,2)}}</td>
                                <td>{{$plan->plan_credit}}</td>
                                <td>
                                    @if($plan->plan_status == 0)
                                        Active
                                    @elseif($plan->plan_status == 1)
                                        InActive
                                    @else
                                        Not Set
                                    @endif
                                </td>
                                <td>{{\Carbon\Carbon::parse($plan->created_date)->format('Y-m-d')}}</td>
                                <td>
                                    <button class="btn btn-primary btn-sm" data-toggle="modal"
                                            data-target="#editplan{{$plan->id}}"><i class="fas fa-edit"></i></button>
                                    <button class="btn btn-danger btn-sm" data-toggle="modal"
                                            data-target="#deleteplan{{$plan->id}}"><i class="fas fa-trash"></i></button>
                                </td>
                            </tr>


                            <div class="modal fade" id="deleteplan{{$plan->id}}" tabindex="-1" role="dialog"
                                 aria-labelledby="exampleModalLabel" aria-hidden="true">
                                <div class="modal-dialog modal-dialog-centered" role="document">
                                    <div class="modal-content">
                                        <div class="modal-header">
                                            <h5 class="modal-title" id="exampleModalLabel">Delete Plan</h5>
                                            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                                <span aria-hidden="true">&times;</span>
                                            </button>
                                        </div>
                                        <form action="{{route('admin.credit.plan.delete')}}" method="post">
                                            @csrf
                                            <div class="modal-body">
                                                <div class="col-md-12">
                                                    are you sure to delete this plan ?
                                                    <input type="hidden" class="form-control" name="plan_delete_id"
                                                           value="{{$plan->id}}">
                                                </div>
                                            </div>
                                            <div class="modal-footer">
                                                <button type="button" class="btn btn-secondary" data-dismiss="modal">
                                                    Close
                                                </button>
                                                <button type="submit" class="btn btn-primary">Save</button>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>


                            <div class="modal fade" id="editplan{{$plan->id}}" tabindex="-1" role="dialog"
                                 aria-labelledby="exampleModalLabel" aria-hidden="true">
                                <div class="modal-dialog modal-dialog-centered" role="document">
                                    <div class="modal-content">
                                        <div class="modal-header">
                                            <h5 class="modal-title" id="exampleModalLabel">Update Credit Plan</h5>
                                            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                                <span aria-hidden="true">&times;</span>
                                            </button>
                                        </div>
                                        <form action="{{route('admin.credit.plan.update')}}" method="post">
                                            @csrf
                                            <div class="modal-body">
                                                <div class="col-md-12">
                                                    <label>Plan Name</label>
                                                    <input type="text" class="form-control" name="plan_name"
                                                           value="{{$plan->plan_name}}">
                                                    <input type="hidden" class="form-control" name="plan_edit_id"
                                                           value="{{$plan->id}}">
                                                </div>
                                                <div class="col-md-12">
                                                    <label>Plan Amount</label>
                                                    <input type="number" class="form-control" name="plan_amount"
                                                           value="{{$plan->plan_amount}}">
                                                </div>
                                                <div class="col-md-12">
                                                    <label>Plan Credit</label>
                                                    <input type="number" class="form-control" name="plan_credit"
                                                           value="{{$plan->plan_credit}}">
                                                </div>
                                                <div class="col-md-12">
                                                    <label>Plan Status</label>
                                                    <select class="form-control" name="plan_status">
                                                        <option value="">select any</option>
                                                        <option value="0" {{$plan->plan_status == 0 ?'selected' : ''}}>
                                                            Active
                                                        </option>
                                                        <option value="1" {{$plan->plan_status == 1 ?'selected' : ''}}>
                                                            Inactive
                                                        </option>
                                                    </select>
                                                </div>
                                            </div>
                                            <div class="modal-footer">
                                                <button type="button" class="btn btn-secondary" data-dismiss="modal">
                                                    Close
                                                </button>
                                                <button type="submit" class="btn btn-primary">Save</button>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>

                        @endforeach

                        </tbody>
                    </table>
                </div>
                {{$all_plans->links()}}
            </div>

        </div>
    </div>


    <div class="modal fade" id="exampleModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel"
         aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="exampleModalLabel">Create New Credit Plan</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <form action="{{route('admin.credit.plan.save')}}" method="post">
                    @csrf
                    <div class="modal-body">
                        <div class="col-md-12">
                            <label>Plan Name</label>
                            <input type="text" class="form-control" name="plan_name">
                        </div>
                        <div class="col-md-12">
                            <label>Plan Amount</label>
                            <input type="number" class="form-control" name="plan_amount">
                        </div>
                        <div class="col-md-12">
                            <label>Plan Credit</label>
                            <input type="number" class="form-control" name="plan_credit">
                        </div>
                        <div class="col-md-12">
                            <label>Plan Status</label>
                            <select class="form-control" name="plan_status">
                                <option value="">select any</option>
                                <option value="0">Active</option>
                                <option value="1">Inactive</option>
                            </select>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                        <button type="submit" class="btn btn-primary">Save</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
@endsection
