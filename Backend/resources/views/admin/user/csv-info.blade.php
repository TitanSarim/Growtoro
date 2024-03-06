@foreach($fields[0] as $key=> $field)
    <table class="table">
        <tr>
            <td width="50%">{{ $field }}</td>
            <td width="50%"><input type="hidden" name="key[]"
                                   value="{{ $key }}">@include('admin.user.select',['value' => $field])</td>
        </tr>
    </table>
@endforeach
<div class="row">
    <div class="col-lg-12">
        <div class="custom-control custom-checkbox">
            <input class="custom-control-input" type="checkbox" id="customCheckbox1"
                   value="1" name="status">
            <label for="customCheckbox1" class="custom-control-label">Check for duplicates
                across all Custom Lead Data</label>
        </div>
    </div>
</div>
<input type="hidden" name="csv_file" value="{{ json_encode($fields) }}">
<input type="hidden" name="list_name" value="{{ $list_name }}">
<input type="hidden" name="user_tenant_id" value="{{ $user_tenant_id }}">
