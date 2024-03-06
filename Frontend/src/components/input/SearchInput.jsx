import { Box, InputAdornment, TextField } from '@mui/material';
import React from 'react';

export default function SearchInput(props) {
  return (
    <Box sx={{ py: 1, pr: 2, ...props.sx }}>
      <TextField
        autoComplete="off"
        sx={{
          fontSize: 1,
          '& input::placeholder': {
            fontSize: '16px',
          },
        }}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <img src="/assets/images/loupe1.png" alt="search" height="20px" width="25px" />
            </InputAdornment>
          ),
        }}
        placeholder={props.placeholder || 'Search by email'}
        value={props.value}
        onChange={(e) => props.onChange(e.target.value)}
        fullWidth
      />
    </Box>
  );
}
