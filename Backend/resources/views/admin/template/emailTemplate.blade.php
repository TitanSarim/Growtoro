@extends('layouts.admin')
@section('admin')

    <div class="content-header">
        <div class="container-fluid">
            <div class="row mb-2">
                <div class="col-sm-6">
                    <h1 class="m-0">Email Template</h1>
                </div><!-- /.col -->
                <div class="col-sm-6">
                    <ol class="breadcrumb float-sm-right">
                        <button class="btn btn-success btn-sm" data-toggle="modal" data-target="#createtemplate">Create
                            Create Email Template
                        </button>
                    </ol>
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

                <div class="card-body table-responsive p-0">

                    <table class="table table-head-fixed text-nowrap">
                        <thead>
                        <tr>
                            <th>#</th>
                            <th>Subject</th>
                            <th>Description</th>
                            <th>Status</th>
                            <th>Created Date</th>
                        </tr>
                        </thead>
                        <tbody>
                        @foreach($email_lits as $key=> $content)
                            @php
                            $str = strip_tags($content->description);
                            $str_len = strlen($str);
                            @endphp
                            <tr>
                                <td>{{ $email_lits->firstItem() + $key }}</td>
                                <td>{{ $content->subject }}</td>
                                <td>{{ substr($str,0,100) }} {{ $str_len > 100 ? '.....' : '' }}</td>
                                <td>
                                    @if($content->status == 1)
                                        Active
                                    @elseif($content->status == 0)
                                        In-Active
                                    @else
                                        Not Set
                                    @endif
                                </td>
                                <td>
                                    <button class="btn btn-success btn-sm edit_template"
                                            data-template="{{ json_encode($content) }}"><i class="fas fa-edit"></i>
                                    </button>
                                    <button class="btn btn-danger btn-sm" data-toggle="modal"
                                            data-target="#deleteVideoContent{{$content->id}}"><i
                                            class="fas fa-trash"></i></button>
                                </td>
                            </tr>
                            <div class="modal fade" id="deleteVideoContent{{$content->id}}" tabindex="-1" role="dialog"
                                 aria-labelledby="exampleModalLabel"
                                 aria-hidden="true">
                                <div class="modal-dialog modal-dialog-centered" role="document">
                                    <div class="modal-content">
                                        <div class="modal-header">
                                            <h5 class="modal-title" id="exampleModalLabel">Delete Email Template</h5>
                                            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                                <span aria-hidden="true">&times;</span>
                                            </button>
                                        </div>
                                        <form action="{{route('admin.email.template.delete')}}" method="post">
                                            @csrf
                                            <div class="modal-body">
                                                <div class="col-md-12">
                                                    <label>are you sure to delete email temaplte ?</label>
                                                    <input type="hidden" name="delete_tem" class="form-control"
                                                           value="{{$content->id}}">
                                                </div>
                                            </div>
                                            <div class="modal-footer">
                                                <button type="button" class="btn btn-secondary" data-dismiss="modal">
                                                    Close
                                                </button>
                                                <button type="submit" class="btn btn-primary">Submit</button>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        @endforeach

                        </tbody>
                    </table>
                    {{ $email_lits->links('vendor.pagination.bootstrap-4') }}
                </div>

            </div>

        </div>
    </div>

    <div class="modal fade" id="createtemplate" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel"
         aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered modal-lg" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="exampleModalLabel">Create New Product</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <form action="{{route('admin.email.template.save')}}" method="post" enctype="multipart/form-data">
                    @csrf
                    <div class="modal-body">
                        <div class="col-md-12">
                            <label>Subject</label>
                            <input type="text" name="subject" class="form-control" required>
                        </div>
                        <div class="col-md-12">
                            <label>Description</label>
                            <div id="editor"></div>
                            <input type="hidden" id="description" name="description">
                        </div>
                        <div class="col-md-12">
                            <label>Status</label>
                            <select class="form-control" name="status" required>
                                <option value="">select any</option>
                                <option value="1">Active</option>
                                <option value="0">In-Active</option>
                            </select>
                        </div>
                        <div class="col-md-12">
                            <label>Tags</label>
                            <div class="select2-purple">
                                <select class="select2" multiple="multiple" name="tags[]" data-placeholder="Select a Tag" data-dropdown-css-class="select2-purple" style="width: 100%;">
                                    <option>Sales</option>
                                    <option>Prospecting</option>
                                    <option>Growth Marketing</option>
                                    <option>Freelancer</option>
                                    <option>SAAS</option>
                                    <option>Follow Up</option>
                                    <option>Networking</option>
                                    <option>Community Building</option>
                                    <option>Agency</option>
                                    <option>Wholesale</option>
                                    <option>Book Meeting</option>
                                    <option>eCommerce</option>
                                </select>
                            </div>
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
                <form action="{{route('admin.email.template.update')}}" method="post">
                    @csrf
                    <div class="modal-body">

                        <div class="col-md-12">
                            <label>Subject</label>
                            <input type="text" name="subject" class="form-control edit_subject" required>
                            <input type="hidden" name="edit_tem" class="form-control edit_id">

                        </div>
                        <div class="col-md-12">
                            <label>Description</label>
                            <div id="editEditor"></div>
                            <input type="hidden" id="edit_description" name="description">
                        </div>
                        <div class="col-md-12">
                            <label>Tags</label>
                            <div class="select2-purple">
                                <select class="select2 edit_tags" multiple="multiple" name="tags[]" data-placeholder="Select a State" data-dropdown-css-class="select2-purple" style="width: 100%;">
                                    <option>Sales</option>
                                    <option>Prospecting</option>
                                    <option>Growth Marketing</option>
                                    <option>Freelancer</option>
                                    <option>SAAS</option>
                                    <option>Follow Up</option>
                                    <option>Networking</option>
                                    <option>Community Building</option>
                                    <option>Agency</option>
                                    <option>Wholesale</option>
                                    <option>Book Meeting</option>
                                    <option>eCommerce</option>
                                </select>
                            </div>
                        </div>
                        <div class="col-md-12">
                            <label>Status</label>
                            <select class="form-control edit_status" name="status" required>
                                <option value="">select any</option>
                                <option value="1">Active</option>
                                <option value="0">In-Active</option>
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
@endsection
@push('css')
    <link rel="stylesheet" href="{{ asset('assets/dashboard/plugins/select2/css/select2.min.css') }}">
    <link href="https://cdn.quilljs.com/1.3.6/quill.snow.css" rel="stylesheet">
@endpush
@push('js')
    <script src="{{asset('assets/dashboard/plugins/select2/js/select2.full.min.js')}}"></script>
    <script src="https://cdn.quilljs.com/1.3.6/quill.js"></script>
    <script>
        $(document).ready(function () {

            $(document).on('click', '.edit_template', function () {
                let template = $(this).data('template');
                $('#edit_template').modal('show');
                $('.edit_id').val(template.id);
                $('.edit_subject').val(template.subject);
                $('.ql-editor').html(template.description);
                $('#edit_description').val(template.description);
                $('.edit_status').val(template.status);
                $('.edit_tags option').each(function (index,option)
                {
                    $(option).attr('selected', false);
                    var flag = -1
                    if(template.tags!=null){

                        flag = template.tags.indexOf(option.text);

                        if(flag !== -1)
                        {

                            $(option).attr('selected',true);
                        }
                    }
                });

                $('.edit_tags').select2();
            });

            $('.select2').select2();
            // quill editor for insert
            var quill = new Quill('#editor', {
                theme: 'snow'
            });

            quill.on('text-change', function(delta, oldDelta, source) {
                $('#description').val(quill.container.firstChild.innerHTML);
            });

            // quill editor for update
            var quillE = new Quill('#editEditor', {
                theme: 'snow'
            });
            quillE.on('text-change', function(delta, oldDelta, source) {
                $('#edit_description').val(quillE.container.firstChild.innerHTML);
            });

        });
    </script>
@endpush
