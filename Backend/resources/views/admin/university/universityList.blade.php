@extends('layouts.admin')
@section('admin')

    <div class="content-header">
        <div class="container-fluid">
            <div class="row mb-2">
                <div class="col-sm-6">
                    <h1 class="m-0">User Plan</h1>
                </div><!-- /.col -->
                <div class="col-sm-6">
                    <ol class="breadcrumb float-sm-right">
                    <button class="btn btn-success btn-sm" data-toggle="modal" data-target="#createVideoContent">Create
                        New Video Content
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

                <div class="card-body table-responsive p-0" style="height: 300px;">
                    <table class="table table-head-fixed text-nowrap">
                        <thead>
                        <tr>
                            <th>Title</th>
                            <th>Video Link</th>
                            <th>Status</th>
                            <th>Created Date</th>
                        </tr>
                        </thead>
                        <tbody>
                        @foreach($all_content as $content)
                            <tr>
                                <td>{{$content->title}}</td>
                                <td>{{$content->video_link}}</td>
                                <td>
                                    @if($content->status == 0)
                                        Active
                                        @elseif($content->status == 1)
                                        In-Active
                                        @else
                                        Not Set
                                        @endif
                                </td>
                                <td>
                                    <button class="btn btn-success btn-sm" data-toggle="modal" data-target="#editVideoContent{{$content->id}}"><i class="fas fa-edit"></i> </button>
                                    <button class="btn btn-danger btn-sm" data-toggle="modal" data-target="#deleteVideoContent{{$content->id}}"><i class="fas fa-trash"></i> </button>
                                </td>

                            </tr>


                            <div class="modal fade" id="editVideoContent{{$content->id}}" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel"
                                 aria-hidden="true">
                                <div class="modal-dialog modal-dialog-centered" role="document">
                                    <div class="modal-content">
                                        <div class="modal-header">
                                            <h5 class="modal-title" id="exampleModalLabel">Create New Product</h5>
                                            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                                <span aria-hidden="true">&times;</span>
                                            </button>
                                        </div>
                                        <form action="{{route('admin.university.update')}}" method="post">
                                            @csrf
                                            <div class="modal-body">
                                                <div class="col-md-12">
                                                    <label>Title</label>
                                                    <input type="text" name="title" class="form-control" value="{{$content->title}}">
                                                    <input type="hidden" name="edit_university" class="form-control" value="{{$content->id}}">
                                                </div>
                                                <div class="col-md-12">
                                                    <label>Video Link</label>
                                                    <input type="text" name="video_link" class="form-control" value="{{$content->title}}">
                                                </div>
                                                <div class="col-md-12">
                                                    <label>Description</label>
                                                    <input type="text" name="description" class="form-control" value="{{$content->title}}">
                                                </div>
                                                <div class="col-md-12">
                                                    <label>Status</label>
                                                    <select class="form-control" name="status">
                                                        <option value="">select any</option>
                                                        <option value="0" {{$content->status == 0 ? 'selected' : ''}}>Active</option>
                                                        <option value="1" {{$content->status == 1 ? 'selected' : ''}}>In-Active</option>
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


                            <div class="modal fade" id="deleteVideoContent{{$content->id}}" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel"
                                 aria-hidden="true">
                                <div class="modal-dialog modal-dialog-centered" role="document">
                                    <div class="modal-content">
                                        <div class="modal-header">
                                            <h5 class="modal-title" id="exampleModalLabel">Delete University Content</h5>
                                            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                                <span aria-hidden="true">&times;</span>
                                            </button>
                                        </div>
                                        <form action="{{route('admin.university.delete')}}" method="post">
                                            @csrf
                                            <div class="modal-body">
                                                <div class="col-md-12">
                                                    <label>are you sure to delete university content ?</label>
                                                    <input type="hidden" name="delete_university" class="form-control" value="{{$content->id}}">
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


                        @endforeach

                        </tbody>
                    </table>
                </div>

            </div>

        </div>
    </div>



    <div class="modal fade" id="createVideoContent" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel"
     aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="exampleModalLabel">Create New Product</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <form action="{{route('admin.university.save')}}" method="post">
                @csrf
                <div class="modal-body">
                <div class="col-md-12">
                        <label>Title</label>
                        <input type="text" name="title" class="form-control">
                    </div>
                    <div class="col-md-12">
                        <label>Video Link</label>
                        <input type="text" name="video_link" class="form-control">
                    </div>
                    <div class="col-md-12">
                        <label>Description</label>
                        <input type="text" name="description" class="form-control">
                    </div>
                    <div class="col-md-12">
                        <label>Status</label>
                        <select class="form-control" name="status">
                            <option value="">select any</option>
                            <option value="0">Active</option>
                            <option value="1">In-Active</option>
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
