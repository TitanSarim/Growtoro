import * as React from 'react';
import { Box, Checkbox } from '@mui/material';
import { AiFillCaretDown } from 'react-icons/ai';

export default function CheckAll({ selectedRows, setSelectedRows, emailList }) {
  const handleClick = () => {
    if (selectedRows.length !== 0 && selectedRows.length === emailList.length) {
      setSelectedRows([]);
    } else {
      const emailListArray = emailList.map((item) => item.id);
      setSelectedRows(emailListArray);
    }
  };

  const isChecked = selectedRows.length !== 0 && selectedRows.length === emailList.length;

  return (
    <Box
      sx={{
        color: '#333333',
        border: '2px solid #E9EBF0',
        borderRadius: '4px',
        width: '90px',
        height: '32px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
      onClick={handleClick}
    >
      <Checkbox size="small" checked={isChecked} />
      <AiFillCaretDown />
    </Box>
  );
}
