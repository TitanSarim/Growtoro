@extends('layouts.admin')
@section('admin')
    <div class="content-header">
        <div class="container-fluid">
            <div class="row mb-2">
                <div class="col-sm-6">
                    <h1 class="m-0">Users</h1>
                </div><!-- /.col -->
                <div class="col-sm-6">
                    <ol class="breadcrumb float-sm-right">

                    </ol>
                </div><!-- /.col -->
            </div><!-- /.row -->
        </div><!-- /.container-fluid -->
    </div>

    <div class="row">
        <div class="col-12">
            <div class="row justify-content-end">
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
                <div class="text-right mb-1">
                    <a href="{{ route('tenant.update.db') }}" class="btn btn-sm btn-primary">Update Tenant Database</a>
                </div>
            </div>
            <div class="card">
                <div class="card-body p-0">
                    <div class="table-responsive">
                        <table class="table table-head-fixed text-nowrap">
                            <thead>
                            <tr>
                                <th>#</th>
                                <th>Email</th>
                                <th>Tenant ID</th>
                                <th>Status</th>
                                <th>Created Date</th>
                                <th>Action</th>
                            </tr>
                            </thead>
                            <tbody>
                            @foreach($users as $key=> $user)
                                <tr>
                                    <td>{{ $users->firstItem() + $key }}</td>
                                    <td>{{ $user->tenant_email }}</td>
                                    <td>{{ $user->tenant_id }}</td>
                                    <td>
                                    <span @class([
        'badge badge-success' => $user->status == 1,
        'badge badge-danger' => $user->status != 1,
])>{{ $user->status == 1 ? 'Active' : 'Inactive' }}</span>
                                    </td>
                                    <td>{{ \Carbon\Carbon::parse($user['created_at'])->format('Y-m-d H:i A') }}</td>
                                    <td>
                                        <div class="dropdown">
                                            <button class="btn btn-primary btn-sm dropdown-toggle" type="button"
                                                    id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true"
                                                    aria-expanded="false">
                                                Action
                                            </button>
                                            <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
                                                <a class="dropdown-item"
                                                   href="{{ route('tenant.status.change',$user->tenant_id) }}">{{ $user->status == 1 ? 'Deactivate' : 'Activate' }}</a>
                                                <a class="dropdown-item" target="_blank"
                                                   href="{{ getUrl() }}/signup?email={{ base64_encode($user->tenant_email) }}">Login</a>
                                                <a class="dropdown-item"
                                                   href="{{ route('get.user.info',$user->tenant_id) }}">View</a>
                                                <a class="dropdown-item"
                                                   href="{{ route('tenant.delete',$user->tenant_id) }}"
                                                   onclick="return confirm('Are you sure? This cannot be undone')">Delete</a>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            @endforeach
                            </tbody>
                        </table>
                        {{ $users->links('vendor.pagination.bootstrap-4') }}
                    </div>
                </div>
            </div>
        </div>
    </div>
@endsection
