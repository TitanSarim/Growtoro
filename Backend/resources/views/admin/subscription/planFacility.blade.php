@extends('layouts.admin')
@section('admin')
    <div class="container-fluid">
        <div class="row">

            <div class="col-md-12">

                <div class="card card-primary">
                    <div class="card-header">
                        <h3 class="card-title">Plan Facility</h3>
                    </div>


                    <form action="{{route('admin.plan.facility.save')}}" method="post">
                        @csrf
                        <div class="card-body">
                            <div class="row">

                                @foreach($plan_fac_list as $fac_list)
                                <div class="col-md-12">
                                    <div class="form-group">
                                        <label for="exampleInputEmail1">Facility Information</label>
                                        <input type="text" class="form-control" name="description[]" value="{{$fac_list->description}}">
                                        <input type="hidden" class="form-control" name="plan_edit_id[]" value="{{$fac_list->id}}">
                                    </div>
                                </div>
                                @endforeach


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
