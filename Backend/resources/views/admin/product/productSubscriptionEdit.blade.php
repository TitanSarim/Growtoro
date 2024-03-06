@extends('layouts.admin')
@section('admin')
    <div class="container-fluid">
        <div class="row">
            <div class="col-md-12">
                <div class="card card-primary">
                    <div class="card-header">
                        <h3 class="card-title">Update Subscription Plan</h3>
                    </div>
                    <form action="{{route('admin.subscription.product.update')}}" method="post">
                        @csrf
                        <input type="hidden" class="form-control" name="update_plan" value="{{$plan->id}}">
                        <div class="card-body">
                            <div class="row">
                                <div class="col-md-12">
                                    <label>Product Name</label>
                                    <input type="text" class="form-control" name="plan_name" value="{{ $plan->plan_name }}">
                                </div>
                                <div class="col-md-12">
                                    <label>Amount</label>
                                    <input type="number" class="form-control" name="plan_amount" value="{{ $plan->plan_amount }}">
                                </div>
                                <div class="col-md-12">
                                    <label>Number of Email Account</label>
                                    <input type="number" class="form-control" name="email_account" value="{{ $plan->email_account }}">
                                </div>
                                <div class="col-md-12">
                                    <label>Number of Active Contacts</label>
                                    <input type="number" class="form-control" name="plan_number_users" value="{{ $plan->plan_number_users }}">
                                </div>
                                <div class="col-md-12">
                                    <label>Number of Email Sent</label>
                                    <input type="number" class="form-control" name="plan_number_email" value="{{ $plan->plan_number_email }}">
                                </div>
                                <div class="col-md-12">
                                    <label>Custom Lead Credit</label>
                                    <input type="number" class="form-control" name="plan_credit" value="{{ $plan->plan_credit }}">
                                </div>

                                <div class="col-md-12">
                                    <label>Status</label>
                                    <select class="form-control" name="plan_status">
                                        <option value="">select any</option>
                                        <option value="0" {{ $plan->plan_status == 0 ? 'selected' : '' }}>Active</option>
                                        <option value="1" {{ $plan->plan_status == 1 ? 'selected' : '' }}>In-Active</option>
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
