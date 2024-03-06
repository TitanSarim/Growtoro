@extends('layouts.admin')
@section('admin')
    <div class="container-fluid">
        <div class="row">

            <div class="col-md-12">

                <div class="card card-primary">
                    <div class="card-header">
                        <h3 class="card-title">Custom Order</h3>
                    </div>


                    <form action="{{route('admin.custom.order.save')}}" method="post">
                        @csrf
                        <div class="card-body">
                            <div class="row">
                                <div class="col-md-4">
                                    <div class="form-group">
                                        <label for="exampleInputEmail1">Choose Plan</label>
                                        <select class="form-control" name="user_id" required>
                                            <option value="">select any</option>
                                            @foreach($plans as $plan)
                                                <option value="{{$plan->id}}">{{$plan->plan_name}}</option>
                                            @endforeach
                                        </select>
                                    </div>
                                </div>
                                <div class="col-md-4">
                                    <div class="form-group">
                                        <label for="exampleInputEmail1">Choose User</label>
                                        <select class="form-control" name="plan_id" required>
                                            <option value="">select any</option>
                                            @foreach($users as $user)
                                                <option value="{{$user['id']}}">{{$user['name']}}</option>
                                            @endforeach
                                        </select>
                                    </div>
                                </div>
                                <div class="col-md-4">
                                    <div class="form-group">
                                        <label for="exampleInputEmail1">Status</label>
                                        <select class="form-control" name="status" required>
                                            <option value="">select any</option>
                                            <option value="0">Active</option>
                                            <option value="1">InActive</option>
                                        </select>
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

@endsection
