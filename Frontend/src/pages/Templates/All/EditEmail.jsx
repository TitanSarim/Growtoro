import React from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

function EditEmail({ value, onChange }) {
  return (
    <ReactQuill
      theme="snow"
      value={value.body}
      onChange={(value) => onChange('body', value)}
      style={{ background: '#F9FAFE', height: '100%', borderRadius: '10px' }}
      className="custom-quill"
    />
  );
}

export default EditEmail;
