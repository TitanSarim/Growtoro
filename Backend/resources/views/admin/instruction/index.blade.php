@extends('layouts.admin')
@section('admin')

    <div class="content-header">
        <div class="container-fluid">
            <div class="row mb-2">
                <div class="col-sm-6">
                    <h1 class="m-0">Instruction</h1>
                </div><!-- /.col -->
            </div><!-- /.row -->
        </div><!-- /.container-fluid -->
    </div>

    <div class="row">
        <div class="col-12">
            <div class="card">
                <div class="card-header">
                    <h3 class="card-title">Instruction Details</h3>
                </div>

                <form method="post" action="{{route('admin.instruction.store')}}" enctype="multipart/form-data">
                    @csrf
                    <div class="card-body table-responsive p-0">
                        <div class="col-md-12">
                            <label>SMTP Details</label>
                            <textarea type="text" name="smtp_details" class="form-control summernote"
                                      required>{{@$instruction->smtp_details}}</textarea>
                        </div>
                    </div>
                    <div class="card-body table-responsive p-0">
                        <div class="col-md-12">
                            <label>SMTP Details Video</label>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-youtube text-red" viewBox="0 0 16 16">
                                <path d="M8.051 1.999h.089c.822.003 4.987.033 6.11.335a2.01 2.01 0 0 1 1.415 1.42c.101.38.172.883.22 1.402l.01.104.022.26.008.104c.065.914.073 1.77.074 1.957v.075c-.001.194-.01 1.108-.082 2.06l-.008.105-.009.104c-.05.572-.124 1.14-.235 1.558a2.007 2.007 0 0 1-1.415 1.42c-1.16.312-5.569.334-6.18.335h-.142c-.309 0-1.587-.006-2.927-.052l-.17-.006-.087-.004-.171-.007-.171-.007c-1.11-.049-2.167-.128-2.654-.26a2.007 2.007 0 0 1-1.415-1.419c-.111-.417-.185-.986-.235-1.558L.09 9.82l-.008-.104A31.4 31.4 0 0 1 0 7.68v-.123c.002-.215.01-.958.064-1.778l.007-.103.003-.052.008-.104.022-.26.01-.104c.048-.519.119-1.023.22-1.402a2.007 2.007 0 0 1 1.415-1.42c.487-.13 1.544-.21 2.654-.26l.17-.007.172-.006.086-.003.171-.007A99.788 99.788 0 0 1 7.858 2h.193zM6.4 5.209v4.818l4.157-2.408L6.4 5.209z"/>
                            </svg>
                            <input type="text" name="smtp_details_video" class="form-control" value="{{@$instruction->smtp_details_video}}">
                        </div>
                    </div>

                    <div class="card-body table-responsive p-0">
                        <div class="col-md-12">
                            <label>IMAP Details</label>
                            <textarea type="text" name="imap_details" class="form-control summernote"
                                      required>{{@$instruction->imap_details}}</textarea>
                        </div>

                        <div class="card-body table-responsive p-0">
                            <div class="col-md-12">
                                <label>IMAP Details Video</label>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-youtube text-red" viewBox="0 0 16 16">
                                    <path d="M8.051 1.999h.089c.822.003 4.987.033 6.11.335a2.01 2.01 0 0 1 1.415 1.42c.101.38.172.883.22 1.402l.01.104.022.26.008.104c.065.914.073 1.77.074 1.957v.075c-.001.194-.01 1.108-.082 2.06l-.008.105-.009.104c-.05.572-.124 1.14-.235 1.558a2.007 2.007 0 0 1-1.415 1.42c-1.16.312-5.569.334-6.18.335h-.142c-.309 0-1.587-.006-2.927-.052l-.17-.006-.087-.004-.171-.007-.171-.007c-1.11-.049-2.167-.128-2.654-.26a2.007 2.007 0 0 1-1.415-1.419c-.111-.417-.185-.986-.235-1.558L.09 9.82l-.008-.104A31.4 31.4 0 0 1 0 7.68v-.123c.002-.215.01-.958.064-1.778l.007-.103.003-.052.008-.104.022-.26.01-.104c.048-.519.119-1.023.22-1.402a2.007 2.007 0 0 1 1.415-1.42c.487-.13 1.544-.21 2.654-.26l.17-.007.172-.006.086-.003.171-.007A99.788 99.788 0 0 1 7.858 2h.193zM6.4 5.209v4.818l4.157-2.408L6.4 5.209z"/>
                                </svg>
                                <input type="text" name="imap_details_video" class="form-control" value="{{@$instruction->imap_details_video}}">
                            </div>
                        </div>
                    </div>

                    <div class="card-body table-responsive p-0">
                        <div class="col-md-12">
                            <label>E-mail account(s) for sending mails</label>
                            <textarea type="text" name="sending_mails" class="form-control summernote"
                                      required>{{@$instruction->sending_mails}}</textarea>
                        </div>
                    </div>

                    <div class="card-body table-responsive p-0">
                        <div class="col-md-12">
                            <label>Max emails per day</label>
                            <textarea type="text" name="max_email_per_day" class="form-control summernote"
                                      required>{{@$instruction->max_email_per_day}}</textarea>
                        </div>
                    </div>

                    <div class="card-body table-responsive p-0">
                        <div class="col-md-12">
                            <label>Delay between sending emails</label>
                            <textarea type="text" name="delay_email" class="form-control summernote"
                                      required>{{@$instruction->delay_email}}</textarea>
                        </div>
                    </div>

                    <div class="card-body table-responsive p-0">
                        <div class="col-md-12">
                            <label>Complete on Reply</label>
                            <textarea type="text" name="complete_on_replay" class="form-control summernote"
                                      required>{{@$instruction->complete_on_replay}}</textarea>
                        </div>
                    </div>

                    <div class="card-footer">
                        <button type="submit" class="btn btn-primary">Submit</button>
                    </div>
                </form>

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
        });
    </script>
@endpush
