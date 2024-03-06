import { Button, Paper, Typography, Container, Box } from '@mui/material';
import React from 'react';
import { styled } from '@mui/material/styles';

const StyledContent = styled('div')(({ theme }) => ({
  maxWidth: 480,
  margin: 'auto',
  minHeight: '100vh',
  display: 'flex',
  justifyContent: 'center',
  flexDirection: 'column',
}));

export default function SomethingWR() {
  // const classes = useStyles();

  return (
    <Container>
      <StyledContent sx={{ textAlign: 'center', alignItems: 'center' }}>
        <svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="40" fill="#FF4136" />
          <line x1="30" y1="30" x2="70" y2="70" stroke="#FFF" strokeWidth="5" strokeLinecap="round" />
          <line x1="30" y1="70" x2="70" y2="30" stroke="#FFF" strokeWidth="5" strokeLinecap="round" />
        </svg>

        <Typography variant="h5" sx={{ fontWeight: 'bold', fontSize: '2rem' }} paragraph>
          Sorry, something went wrong!
        </Typography>

        <Typography sx={{ color: 'text.secondary', marginBottom: '1.5rem' }}>
          We encountered an issue on our website. Please try reloading the page or try again later. We appreciate your
          patience.
        </Typography>

        {/* <Box
          component="img"
          src="/assets/illustrations/illustration_404.svg"
          sx={{ height: 260, mx: 'auto', my: { xs: 3, sm: 6 } }}
        /> */}

        <Button
          to="/"
          size="large"
          variant="contained"
          sx={{
            backgroundColor: '#7b68ee',
          }}
          onClick={() => {
            window.location.href = '/';
          }}
        >
          Go to Home
        </Button>
      </StyledContent>
    </Container>
  );
}
