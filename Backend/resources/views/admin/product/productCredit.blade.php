@extends('layouts.admin')
@section('admin')
    <div class="container-fluid">
        <div class="row">
            <div class="col-md-12">
                <div class="card card-primary">
                    <div class="card-header">
                        <h3 class="card-title">Create Credit Plan</h3>
                    </div>
                    <form action="{{route('admin.credit.product.save')}}" method="post">
                        @csrf
                        <div class="card-body">
                            <div class="row">
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
