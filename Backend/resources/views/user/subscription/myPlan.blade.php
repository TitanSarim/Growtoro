@extends('layouts.user')
@section('user')

    <div class="content-header">
        <div class="container-fluid">
            <div class="row mb-2">
                <div class="col-sm-6">
                    <h1 class="m-0">Subscription Plan</h1>
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

                            <th>Plan Name</th>
                            <th>Plan Amount</th>
                            <th>Status</th>
                            <th>Created Date</th>
                            <th>Action</th>
                        </tr>
                        </thead>
                        <tbody>
                        @if($plan)
                            <tr>
                                <td>${{$plan->plan->plan_name ?? ''}}</td>

                                <td>${{number_format($plan->plan->plan_amount ?? 0,2)}}

                                </td>
                                <td>
                                    @if($plan->status == 0 )
                                        Active
                                    @elseif($plan->status == 1 )
                                        InActive
                                    @else
                                        Not Set
                                    @endif
                                </td>
                                <td>{{ \Carbon\Carbon::parse($plan->created_date)->format('Y-m-d')}}</td>
                                <td>
                                    @if($plan->status != 1 )
                                        <a href="{{route('user.payment.stripe',['id'=>$plan->plan_id,'type'=>$plan->plan->plan_type])}}">
                                            <button class="btn btn-primary btn-sm"><i class="fas fa-dollar-sign"></i>
                                            </button>
                                        </a>
                                    @endif


                                    <button class="btn btn-primary btn-sm" data-toggle="modal"
                                            data-target="#upgradeplan"><i
                                            class="fas fa-shopping-cart"></i></button>

                                </td>
                            </tr>


                            <div class="modal fade" id="upgradeplan" tabindex="-1" role="dialog"
                                 aria-labelledby="exampleModalLabel" aria-hidden="true">
                                <div class="modal-dialog modal-dialog-centered" role="document">
                                    <div class="modal-content">
                                        <div class="modal-header">
                                            <h5 class="modal-title" id="exampleModalLabel">Upgrade Plan</h5>
                                            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                                <span aria-hidden="true">&times;</span>
                                            </button>
                                        </div>
                                        <form action="{{route('user.plan.change')}}" method="post">
                                            @csrf
                                            <div class="modal-body">
                                                <div class="col-md-12">
                                                    <label>Choose Plan</label>
                                                    <select class="form-control" name="user_plan_id">
                                                        <option value="">select any</option>
                                                        @foreach($all_plans as $plan)
                                                            <option value="{{$plan->id}}">{{$plan->plan_name}}</option>
                                                        @endforeach
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
                        @endif


                        </tbody>
                    </table>
                </div>
            </div>

        </div>
    </div>

@endsection
