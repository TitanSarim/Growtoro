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
                            <th>Action</th>
                        </tr>
                        </thead>
                        <tbody>
                        @foreach($plans as $plan)
                            <tr>
                                <td>{{$plan->plan_name}}</td>
                                <td>${{number_format($plan->plan_amount,2)}}</td>
                                <td>
                                    @if($user_plan_count <= 0)
                                        <a href="{{route('user.choose.plan',$plan->id)}}">
                                            <button class="btn btn-primary btn-sm"><i class="fas fa-shopping-cart"></i>
                                            </button>
                                        </a>
                                    @else
                                        <button class="btn btn-primary btn-sm" data-toggle="modal"
                                                data-target="#upgradeplan{{$plan->id}}"><i
                                                class="fas fa-shopping-cart"></i></button>
                                    @endif
                                </td>
                            </tr>


                            <div class="modal fade" id="upgradeplan{{$plan->id}}" tabindex="-1" role="dialog"
                                 aria-labelledby="exampleModalLabel" aria-hidden="true">
                                <div class="modal-dialog modal-dialog-centered" role="document">
                                    <div class="modal-content">
                                        <div class="modal-header">
                                            <h5 class="modal-title" id="exampleModalLabel">Update Plan</h5>
                                            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                                <span aria-hidden="true">&times;</span>
                                            </button>
                                        </div>
                                        <form action="{{route('user.plan.change')}}" method="post">
                                            @csrf
                                            <div class="modal-body">
                                                <div class="col-md-12">
                                                    are you sure to change you plan with this ?
                                                    <input type="hidden" name="user_plan_id" value="{{$plan->id}}">
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
                {{$plans->links()}}
            </div>

        </div>
    </div>

@endsection
