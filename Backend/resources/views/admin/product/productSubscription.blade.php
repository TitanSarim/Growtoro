@extends('layouts.admin')
@section('admin')
    <div class="container-fluid">
        <div class="row">
            <div class="col-md-12">
                @if(session()->has('success'))
                    <div class="alert alert-success alert-dismissible fade show" role="alert">
                        <strong>Success!</strong> {{ session()->get('success') }}
                        <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                @endif
                @if(session()->has('error'))
                    <div class="alert alert-danger alert-dismissible fade show" role="alert">
                        <strong>Error!</strong> {{ session()->get('error') }}
                        <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                @endif
            </div>
            <div class="col-md-12">
                <div class="card card-primary">
                    <div class="card-header">
                        <h3 class="card-title">Create Subscription Plan</h3>
                    </div>
                    <form action="{{route('admin.subscription.product.save')}}" method="post">
                        @csrf
                        <div class="card-body">
                            <div class="row">

                                <div class="col-md-12">
                                    <label>Product Name</label>
                                    <input type="text" class="form-control" name="plan_name">
                                </div>
                                <div class="col-md-12">
                                    <label>Amount</label>
                                    <input type="number" class="form-control" name="plan_amount">
                                </div>
                                <div class="col-md-12">
                                    <label>Number of Email Account</label>
                                    <input type="number" class="form-control" name="email_account">
                                </div>
                                <div class="col-md-12">
                                    <label>Number of Active Contacts</label>
                                    <input type="number" class="form-control" name="plan_number_users">
                                </div>
                                <div class="col-md-12">
                                    <label>Number of Email Sent</label>
                                    <input type="number" class="form-control" name="plan_number_email">
                                </div>
                                <div class="col-md-12">
                                    <label>Custom Lead Credit</label>
                                    <input type="number" class="form-control" name="plan_credit">
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
                        </div>
                        <div class="card-footer">
                            <button type="submit" class="btn btn-primary">Submit</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
@endsection
