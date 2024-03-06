@extends('layouts.admin')
@section('admin')

<div class="content-header">
    <div class="container-fluid">
        <div class="row mb-2">
            <div class="col-sm-6">
                <h1 class="m-0">Product Management</h1>
            </div><!-- /.col -->
            <div class="col-sm-6">
                <ol class="breadcrumb float-sm-right">
                    <button class="btn btn-success btn-sm" data-toggle="modal" data-target="#createProduct">Create
                        New Product
                    </button>
                </ol>
            </div><!-- /.col -->
        </div><!-- /.row -->
    </div><!-- /.container-fluid -->
</div>



<div class="modal fade" id="createProduct" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel"
     aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="exampleModalLabel">Create New Product</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <form action="{{route('admin.product.create.type')}}" method="post">
                @csrf
                <div class="modal-body">
                    <div class="col-md-12">
                        <label>Product Type</label>
                        <select class="form-control" name="plan_type">
                            <option value="">select any</option>
                            <option value="1">Subscription</option>
                            <option value="2">Credit</option>
                        </select>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                    <button type="submit" class="btn btn-primary">Submit</button>
                </div>
            </form>
        </div>
    </div>
</div>


<div class="row">
    <div class="col-12">
        <div class="card">

            <div class="card-body table-responsive p-0">
                <table class="table table-head-fixed text-nowrap">
                    <thead>
                    <tr>
                        <th>Plan Name</th>
                        <th>Plan Amount</th>
                        <th>Plan Credit</th>
                        <th>Status</th>
                        <th>Type</th>
                        <th>Created Date</th>
                        <th>Action</th>
                    </tr>
                    </thead>
                    <tbody>
                    @foreach($all_plans as $plan)
                        <tr>
                            <td>{{$plan->plan_name}}</td>
                            <td>{{$plan->plan_amount}}</td>
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
                            <td>
                                @if($plan->plan_type == 1)
                                    Subscription
                                @elseif($plan->plan_type == 2)
                                    Credit
                                @else
                                    Not Set
                                @endif
                            </td>
                            <td>{{\Carbon\Carbon::parse($plan->created_at)->format('m/d/Y')}}</td>
                            <td>
                                @if($plan->plan_type == 1)
                                    <a href="{{route('admin.subscription.product.edit',$plan->id)}}">
                                        <button class="btn btn-success btn-sm">
                                            <i class="fas fa-edit"></i>
                                        </button>
                                    </a>
                                    <button class="btn btn-danger btn-sm" data-toggle="modal" data-target="#deletesubscriptionplan{{$plan->id}}">
                                        <i class="fas fa-trash"></i>
                                    </button>
                                @endif

                                    @if($plan->plan_type == 2)
                                        <a href="{{route('admin.credit.product.edit',$plan->id)}}">
                                            <button class="btn btn-success btn-sm">
                                                <i class="fas fa-edit"></i>
                                            </button>
                                        </a>

                                        <button class="btn btn-danger btn-sm" data-toggle="modal" data-target="#deletecreditplan{{$plan->id}}">
                                            <i class="fas fa-trash"></i>
                                        </button>
                                    @endif


                            </td>

                        </tr>


                        <div class="modal fade" id="deletesubscriptionplan{{$plan->id}}" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel"
                             aria-hidden="true">
                            <div class="modal-dialog modal-dialog-centered" role="document">
                                <div class="modal-content">
                                    <div class="modal-header">
                                        <h5 class="modal-title" id="exampleModalLabel">Delete Subscription Product</h5>
                                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                            <span aria-hidden="true">&times;</span>
                                        </button>
                                    </div>
                                    <form action="{{route('admin.subscription.product.delete')}}" method="post">
                                        @csrf
                                        <div class="modal-body">
                                            <div class="col-md-12">
                                                are you sure to delete subscription product ?
                                                <input type="hidden" class="form-control" name="delete_subs_product" value="{{$plan->id}}">
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



                        <div class="modal fade" id="deletecreditplan{{$plan->id}}" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel"
                             aria-hidden="true">
                            <div class="modal-dialog modal-dialog-centered" role="document">
                                <div class="modal-content">
                                    <div class="modal-header">
                                        <h5 class="modal-title" id="exampleModalLabel">Delete Credit Product</h5>
                                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                            <span aria-hidden="true">&times;</span>
                                        </button>
                                    </div>
                                    <form action="{{route('admin.credit.product.delete')}}" method="post">
                                        @csrf
                                        <div class="modal-body">
                                            <div class="col-md-12">
                                                are you sure to delete credit product ?
                                                <input type="hidden" class="form-control" name="delete_cred_product" value="{{$plan->id}}">
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



                    @endforeach

                    </tbody>
                </table>
                {{$all_plans->links()}}
            </div>
        </div>

    </div>
</div>


<div class="modal fade" id="exampleModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel"
     aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="exampleModalLabel">Create New Product</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <form action="" method="post">
                @csrf
                <div class="modal-body">
                    <div class="col-md-12">
                        <label>Product Name</label>
                        <input type="text" class="form-control" name="plan_name">
                    </div>
                    <div class="col-md-12">
                        <label>Amount</label>
                        <input type="number" class="form-control" name="plan_amount">
                    </div>
                    <div class="col-md-12">
                        <label>Credit</label>
                        <input type="number" class="form-control" name="plan_credit">
                    </div>
                    <div class="col-md-12">
                        <label>Exp Date</label>
                        <input type="number" class="form-control" name="exp_date">
                    </div>
                    <div class="col-md-12">
                        <label>Number of Email</label>
                        <input type="number" class="form-control" name="plan_number_email">
                    </div>
                    <div class="col-md-12">
                        <label>Number of Users</label>
                        <input type="number" class="form-control" name="plan_number_users">
                    </div>
                    <div class="col-md-12">
                        <label>Recurrence</label>
                        <select class="form-control" name="plan_recurrence">
                            <option value="">select any</option>
                            <option value="monthly">Monthly</option>
                            <option value="quarterly">Quarterly</option>
                            <option value="annual">Annual</option>
                        </select>
                    </div>
                    <div class="col-md-12">
                        <label>Overage</label>
                        <input type="number" class="form-control" name="plan_overage">
                    </div>
                    <div class="col-md-12">
                        <label>Trial Period</label>
                        <input type="number" class="form-control" name="plan_trial_days">
                    </div>
                    <div class="col-md-12">
                        <label>Custom Credit</label>
                        <input type="number" class="form-control" name="custom_credit" >
                    </div>
                    <div class="col-md-12">
                        <label>Status</label>
                        <select class="form-control" name="plan_status">
                            <option value="">select any</option>
                            <option value="0">Active</option>
                            <option value="1">In-Active</option>
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
