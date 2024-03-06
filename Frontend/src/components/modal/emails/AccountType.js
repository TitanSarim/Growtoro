import * as React from 'react';
import { Box, Stack } from '@mui/material';

const AccountType = ({ imageSource, title, details, onClick = () => {} }) => (
    <Stack
      direction="column"
      justifyContent="center"
      alignItems="center"
      sx={{
        background: '#FFFFFF',
        border: '1px solid rgba(185, 190, 199, 0.6)',
        borderRadius: '10px',
        p: '16px',
        cursor: 'pointer',
      }}
      spacing="10px"
      onClick={onClick}
    >
      <img src={imageSource} alt="icon" height="35px" width="35px" />
      <Box
        sx={{
          fontFamily: 'Inter',
          fontStyle: 'normal',
          fontWeight: 500,
          fontSize: '16px',
          lineHeight: '19 px',
          textAlign: 'center',
          color: '#333333',
        }}
      >
        {title}
      </Box>
      <Box
        sx={{
          fontFamily: 'Inter',
          fontStyle: 'normal',
          fontWeight: 400,
          fontSize: '12px',
          lineHeight: '15px',
          textAlign: 'center',
          color: '#333333',
        }}
      >
        {details}
      </Box>
    </Stack>
  );

export default AccountType;
