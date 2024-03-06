@extends('layouts.admin')
@section('admin')
    <div class="container-fluid">
        <div class="row">
            @if(session()->has('success'))
                <div class="col-lg-12">
                    <div class="alert alert-success alert-dismissible fade show" role="alert">
                        <strong>Success! </strong>{{ session()->get('success') }}
                        <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                </div>
            @endif
            @if(session()->has('error'))
                <div class="col-lg-12">
                    <div class="alert alert-danger alert-dismissible fade show" role="alert">
                        <strong>Error! </strong>{{ session()->get('error') }}
                        <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                </div>
            @endif
            @if($user)
                <div class="col-md-12">
                    <div class="card card-primary">
                        <div class="card-header">
                            <h3 class="card-title">Account Info</h3>
                        </div>
                        <form action="{{ route('tenant.user.update') }}" method="post" enctype="multipart/form-data">@csrf
                            <div class="card-body">
                                <div class="row">
                                    <input type="hidden" name="user_tenant_id" id="user_tenant_id"
                                           value="{{ $tenant_id }}">
                                    <div class="col-md-12">
                                        <div class="form-group">
                                            <label for="name">Name</label>
                                            <input type="text" class="form-control" placeholder="Enter name"
                                                   id="name" name="name" value="{{ old('name',$user->name) }}">
                                            <span class="text-danger">{{ $errors->first('name') }}</span>
                                        </div>

                                    </div>
                                    <div class="col-md-12">
                                        <div class="form-group">
                                            <label for="email">Email</label>
                                            <input type="email" class="form-control" placeholder="Enter email"
                                                   id="email" name="email" value="{{ old('email',$user->email) }}">
                                            <span class="text-danger">{{ $errors->first('email') }}</span>
                                        </div>
                                    </div>
                                    <div class="col-md-12">
                                        <div class="form-group">
                                            <label for="password">Password</label>
                                            <input type="password" class="form-control" placeholder="Enter password"
                                                   id="password" name="password">
                                            <span class="text-danger">{{ $errors->first('password') }}</span>
                                        </div>
                                    </div>
                                    <div class="col-md-12">
                                        <div class="form-group">
                                            <label for="password_confirmation">Confirm Password</label>
                                            <input type="password" class="form-control" placeholder="Confirm Password"
                                                   id="password_confirmation" name="password_confirmation">
                                        </div>
                                    </div>
                                    <div class="col-md-12">
                                        <div class="form-group">
                                            <label for="image">Image</label>
                                            <input type="file" class="form-control"
                                                   id="image" name="image">
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
            @endif
            @if($subscription)
                <div class="col-md-12">
                    <div class="card card-primary">
                        <div class="card-header">
                            <h3 class="card-title">Active Subscription</h3>
                        </div>
                        <form action="{{ route('tenant.plan.update') }}" method="post">
                            @csrf
                            <div class="card-body">
                                <div class="row">
                                    <input type="hidden" name="user_tenant_id" id="tenant_id" value="{{ $tenant_id }}">
                                    <input type="hidden" name="id" value="{{ $subscription->id }}">
                                    <div class="col-md-12">
                                        <div class="form-group">
                                            <label for="plan_name">Plan Name</label>
                                            <input type="text" disabled class="form-control"
                                                   id="plan_name" name="plan_name"
                                                   value="{{ $subscription->plan->plan_name }}">
                                            <span class="text-danger">{{ $errors->first('plan_name') }}</span>
                                        </div>
                                    </div>
                                    <div class="col-md-12">
                                        <div class="form-group">
                                            <label for="plan_credit">Plan Lead Credits</label>
                                            <input type="number" class="form-control"
                                                   id="plan_credit" name="plan_credit"
                                                   value="{{ $subscription->plan_credit }}">
                                            <span class="text-danger">{{ $errors->first('plan_credit') }}</span>
                                        </div>
                                    </div>
                                    <div class="col-md-12">
                                        <div class="form-group">
                                            <label for="custom_credit">Custom Lead Credits</label>
                                            <input type="number" class="form-control"
                                                   id="custom_credit" name="custom_credit"
                                                   value="{{ $subscription->used_credit }}">
                                            <span class="text-danger">{{ $errors->first('used_credit') }}</span>
                                        </div>
                                    </div>
                                    @if($one_time_credit)
                                        <div class="col-md-12">
                                            <div class="form-group">
                                                <label for="custom_credit">One Time Lead Credits</label>
                                                <input type="number" class="form-control"
                                                       id="one_time_credit" name="one_time_credit"
                                                       value="{{ $one_time_credit }}">
                                                <span class="text-danger">{{ $errors->first('credits') }}</span>
                                            </div>
                                        </div>
                                    @endif
                                </div>
                            </div>
                            <div class="card-footer">
                                <button type="submit" class="btn btn-primary">Submit</button>
                            </div>
                        </form>
                    </div>
                </div>
            @endif
            <div class="col-md-12">
                <div class="card card-primary">
                    <div class="card-header">
                        <h3 class="card-title">Upload List</h3>
                    </div>
                    <form action="#" method="post" class="csv_upload" enctype="multipart/form-data">@csrf
                        <div class="card-body">
                            <div class="row">
                                {{--<div class="col-lg-12 text-right">
                                    <a href="{{ asset('csv/b2b.csv') }}" class="b2b" download="b2b"><i
                                            class="fa fa-download"></i>Download B2B Sample file</a>
                                    <a href="{{ asset('csv/b2c.csv') }}" class="b2c d-none" download="b2c"><i
                                            class="fa fa-download"></i>Download B2C Sample file</a>
                                </div>--}}
                                <input type="hidden" name="user_tenant_id" id="user_tenant_id" value="{{ $tenant_id }}">
                                <div class="col-md-12">
                                    <div class="form-group">
                                        <label for="list_name">List Name</label>
                                        <input type="text" class="form-control" placeholder="Enter list name"
                                               id="list_name" name="list_name">
                                    </div>
                                </div>
                                {{--<div class="col-md-12">
                                    <div class="form-group">
                                        <label for="list_name">List Type</label>
                                        <select name="list_type" id="list_type" class="form-control">
                                            <option value="b2b">B2B</option>
                                            <option value="b2c">B2C</option>
                                        </select>
                                    </div>
                                </div>--}}
                                <div class="col-md-12">
                                    <div class="form-group">
                                        <label for="file">CSV File</label>
                                        <input type="file" class="form-control"
                                               id="file" name="csv_file" accept=".csv">
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
    <div class="modal fade" id="csv_info" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle"
         aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="exampleModalLongTitle">CSV Upload</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <form action="{{ route('tenant.list.upload') }}" method="post" enctype="multipart/form-data">@csrf
                    <div class="modal-body csv_modal_check">


                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                        <button type="submit" class="btn btn-primary">Save changes</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
    <div class="modal fade" id="add_attribute" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle"
         aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="exampleModalLongTitle">Custom Variable</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body">
                    <input type="text" class="form-control attribute">
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                    <button type="button" class="btn btn-primary save_attribute">Save changes</button>
                </div>
            </div>
        </div>
    </div>
@endsection
@push('js')
    <script>
        $(document).ready(function () {
            $(document).on('change', '#list_type', function () {
                let val = $(this).val();
                if (val == 'b2b') {
                    $('.b2c').addClass('d-none');
                    $('.b2b').removeClass('d-none');
                } else {
                    $('.b2b').addClass('d-none');
                    $('.b2c').removeClass('d-none');
                }
            });
            $(document).on('submit', '.csv_upload', function (e) {
                e.preventDefault();
                let form_data = new FormData(this);
                let form_selector = this;
                $(this).find('button').addClass('btn_disable')
                $.ajax({
                    url: "/admin/tenant/check-csv",
                    method: "POST",
                    data: form_data,
                    processData: false,
                    contentType: false,
                    success: function (response) {
                        if (response.success) {
                            $(form_selector).find('button').removeClass('btn_disable');
                            let selector = $('#csv_info');
                            selector.modal('show');
                            selector.find('.modal-body').html(response.html);
                        } else {
                            $(form_selector).find('button').removeClass('btn_disable');
                            alert(response.error);
                        }
                    },
                    error: function (error) {
                        $(form_selector).find('button').removeClass('btn_disable');
                    }
                })
            });
            $(document).on('change', '.common_field', function (e) {
                let val = $(this).val();
                if (val == 'custom') {
                    $('#add_attribute').modal('show');
                }
            });
            $(document).on('click', '.save_attribute', function (e) {
                let val = $('.attribute').val();
                var selectElement = $('.common_field');

                // Create a new option element
                var newOption = $('<option>', {
                    value: val.replace(' ', '_').toLowerCase(),
                    text: val
                });

                // Append the new option to the select element
                selectElement.append(newOption);
                $('#add_attribute').modal('hide');
            });
        });
    </script>
@endpush
