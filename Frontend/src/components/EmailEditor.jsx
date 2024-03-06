import React from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

function EmailEditor({ value, setValue }) {
  const handleQuillChange = (value) => {
    // Check if value is '<p><br/><p>' and convert it to ''
    if (value === '<p><br></p>') {
      setValue('');
    } else {
      setValue(value);
    }
  };
  return (
    <ReactQuill
      toolbar={(a) => console.log(a)}
      theme="snow"
      value={value}
      onChange={handleQuillChange}
      style={{ background: 'white' }}
    />
  );
}

export default EmailEditor;
