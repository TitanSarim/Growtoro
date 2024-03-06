@extends('layouts.admin')
@section('admin')
    <div class="container-fluid">
        <div class="content-header">
            <div class="container-fluid">
                <div class="row mb-2">
                    <div class="col-sm-6">
                        <h1 class="m-0">Custom Lead Faq's</h1>
                    </div><!-- /.col -->
                    <div class="col-sm-6">
                        <ol class="breadcrumb float-sm-right">
                            <button class="btn btn-success btn-sm" data-toggle="modal" data-target="#createFaq">Create
                                New Faq
                            </button>
                        </ol>
                    </div><!-- /.col -->
                </div><!-- /.row -->
            </div><!-- /.container-fluid -->
        </div>
        @if(session()->has('success'))
            <div class="col-lg-12">
                <div class="alert alert-success alert-dismissible fade show" role="alert">
                    <strong>Success!</strong>{{ session()->get('success') }}
                    <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
            </div>
        @endif
        @if(session()->has('error'))
            <div class="col-lg-12">
                <div class="alert alert-success alert-dismissible fade show" role="alert">
                    <strong>Error!</strong>{{ session()->get('error') }}
                    <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
            </div>
        @endif
        <div class="row">
            <div class="col-12">
                <div class="card">
                    <div class="card-body table-responsive p-0">
                        <table class="table table-head-fixed text-nowrap">
                            <thead>
                            <tr>
                                <th>#</th>
                                <th>Question</th>
                                <th>Answer</th>
                                <th>Type</th>
                                <th>Status</th>
                                <th>Created Date</th>
                                <th>Action</th>
                            </tr>
                            </thead>
                            <tbody>
                            @foreach($faqs as $key=> $faq)
                                @php
                                    $length = strlen($faq->answer);
                                @endphp
                                <tr>
                                    <td>{{ $faqs->firstItem() + $key }}</td>
                                    <td>{{ $faq->question }}</td>
                                    <td>{!!substr($faq->answer,0,100).($length > 100 ? '....' : '')  !!}</td>
                                    <td class="text-capitalize">{{ $faq->type }}</td>
                                    <td>
                                        @if($faq->status == 1)
                                            Active
                                        @else
                                            Inactive
                                        @endif
                                    </td>
                                    <td>{{ \Carbon\Carbon::parse($faq->created_at)->format('m/d/Y') }}</td>
                                    <td>
                                        <a href="javascript:void(0)" class="edit_faq" data-faq="{{ json_encode($faq) }}"><i
                                                class="fa fa-edit"></i></a>
                                        <a href="{{ route('faqs.destroy',$faq->id) }}" onclick="return confirm('Are you sure?')">
                                            <i class="fas fa-trash"></i>
                                        </a>
                                    </td>
                                </tr>
                            @endforeach
                            </tbody>
                        </table>
                        {{ $faqs->links('vendor.pagination.bootstrap-4') }}
                    </div>
                </div>

            </div>
        </div>
        <div class="modal fade" id="createFaq" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel"
             aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered modal-lg" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="exampleModalLabel">Create New Faq</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <form action="{{route('faqs.store')}}" method="post">
                        @csrf
                        <div class="modal-body">
                            <div class="col-lg-12">
                                <label>Question</label>
                                <input type="text" name="question" class="form-control" required>
                            </div>
                            <div class="col-lg-12">
                                <label>Answer</label>
                                <textarea type="text" name="answer" class="form-control summernote" required></textarea>
                            </div>
                            <div class="col-md-12">
                                <label>Faq Type</label>
                                <select class="form-control" name="type">
                                    <option value="">select any</option>
                                    <option value="company">Company Faq</option>
                                    <option value="job">Job Titles Faq</option>
                                    <option value="location">Locations Faq</option>
                                    <option value="audience">Audience Faq</option>
                                    <option value="channels">Channels Faq</option>
                                </select>
                            </div>
                            <div class="col-md-12">
                                <label>Status</label>
                                <select class="form-control" name="status">
                                    <option value="1">Active</option>
                                    <option value="0">Inactive</option>
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
        <div class="modal fade" id="editFaq" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel"
             aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered modal-lg" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="exampleModalLabel">Create New Faq</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <form action="{{route('faqs.update')}}" method="post">
                        @csrf
                        <input type="hidden" name="id" class="id" value="">
                        <div class="modal-body">
                            <div class="col-lg-12">
                                <label>Question</label>
                                <input type="text" name="question" class="form-control question" required>
                            </div>
                            <div class="col-lg-12">
                                <label>Answer</label>
                                <textarea type="text" name="answer" class="form-control answer summernote" required></textarea>
                            </div>
                            <div class="col-md-12">
                                <label>Faq Type</label>
                                <select class="form-control type" name="type">
                                    <option value="">select any</option>
                                    <option value="company">Company Faq</option>
                                    <option value="job">Job Titles Faq</option>
                                    <option value="location">Locations Faq</option>
                                    <option value="audience">Audience Faq</option>
                                    <option value="channels">Channels Faq</option>
                                </select>
                            </div>
                            <div class="col-md-12">
                                <label>Status</label>
                                <select class="form-control status" name="status">
                                    <option value="1">Active</option>
                                    <option value="0">Inactive</option>
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
    </div>
@endsection
@push('css')
    <link href="{{ asset('assets/dashboard/dist/css/summernote.min.css') }}" rel="stylesheet">
@endpush
@push('js')
    <script src="{{ asset('assets/dashboard/dist/js/summernote.min.js') }}"></script>
    <script>
        $(document).ready(function () {
            $('.summernote').summernote({
                height: 250
            });
            $(document).on('click', '.edit_faq', function () {
                let faq = $(this).data('faq');
                $('#editFaq').modal('show');
                $('.id').val(faq.id);
                $('.question').val(faq.question);
                $('.answer').summernote('code', faq.answer);
                $('.type').val(faq.type);
                $('.status').val(faq.status);
            });
        });
    </script>
@endpush
