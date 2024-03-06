@extends('layouts.admin')
@section('admin')
    <div class="content-header">
        <div class="container-fluid">
            <div class="row mb-2">
                <div class="col-sm-6">
                    <h1 class="m-0">Domain Tracking</h1>
                </div><!-- /.col -->


            </div><!-- /.row -->
            <div class="row">
                @if(session('success') == 1)

                    <div class="alert alert-success col-12">{{session('message')}}</div>
                @endif
                @if(session('success') === 0)

                    <div class="alert alert-danger col-12">{{session('message')}}</div>
                @endif
            </div>
        </div><!-- /.container-fluid -->
    </div>

    <div class="row">
        <div class="col-12">
            <div class="card">
                <div class="card-body table-responsive p-0">

                    <table class="table table-head-fixed text-nowrap">
                        <thead>
                        <tr>
                            <th>#</th>
                            <th>Domain</th>
                            <th>Action</th>

                        </tr>
                        </thead>
                        <tbody>


                            <tr>
                                <td>#</td>
                                <td>{{ @$domain->domain }}</td>

                                <td>
                                    <button class="btn btn-success btn-sm edit_template"
                                            data-template="{{ json_encode($domain) }}"><i class="fas fa-edit"></i>
                                    </button>
                                </td>
                            </tr>



                        </tbody>
                    </table>

                </div>

            </div>

        </div>
    </div>
    <div class="modal fade" id="edit_template" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel"
         aria-hidden="true">
        <div class="modal-dialog modal-lg modal-dialog-centered" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="exampleModalLabel">Create New Email Template</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <form action="{{route('domain.tracking.update')}}" method="post">
                    @csrf
                    <div class="modal-body">
                        <div class="col-md-12">
                            <label>Domain Name</label>
                            <input type="text" name="name" class="form-control edit_name" required>
                            <input type="hidden" name="id" class="form-control edit_id">
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

@endsection

@push('js')

    <script>
        $(document).ready(function () {
            $(document).on('click', '.edit_template', function () {
                let template = $(this).data('template');
                $('#edit_template').modal('show');
                $('.edit_id').val(template.id);
                $('.edit_name').val(template.domain);
            });
        });
    </script>
@endpush
