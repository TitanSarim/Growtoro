<select name="fields[]" class="form-control common_field">
    @foreach($common_fields as $common_field)
        <option value="{{ strtolower(str_replace(' ','_',$common_field)) }}" {{ $common_field == $value ? 'selected' : '' }}>{{ $common_field }}</option>
    @endforeach
</select>
