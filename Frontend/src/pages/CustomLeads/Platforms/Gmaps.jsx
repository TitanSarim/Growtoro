import React from 'react';
import { Box, Button, Slider, Stack, TextField, Typography, Tooltip } from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
// eslint-disable-next-line import/named
import { accordData1 } from '_mock/cusomleads';
import FaqQuestions from '../Faq';

const Gmaps = () => (
  <>
    <Stack direction="row" alignItems="center" spacing={1} sx={{ pt: '1.8rem' }}>
      <Typography
        variant="body1"
        sx={{
          fontFamily: 'Inter',
          fontStyle: 'normal',
          fontWeight: 700,
          fontSize: '16px',
          lineHeight: '19px',
        }}
      >
        Business Categories
      </Typography>
      <a
        href="https://www.omnicoreagency.com/google-business-profile-categories-list/"
        target="_blank"
        rel="noopener noreferrer"
        style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}
      >
        <Tooltip title="View the complete list of Google Maps Business" placement="top-start">
          <InfoIcon sx={{ color: 'black', alignSelf: 'center' }} />
        </Tooltip>
      </a>
    </Stack>
    <Typography sx={{ width: '280px', py: '1rem' }}>
      Enter your business categories (maximum of 3, separated by comma)
    </Typography>
    <TextField placeholder="ex. Grocery Stores, Aikido Club" sx={{ width: '100%' }} />
    <Typography variant="h6" sx={{ pt: '1.2rem' }}>
      Emails
    </Typography>
    <Typography sx={{ pt: '0.2rem', pb: '0.8rem' }}>Choose the number of emails you want</Typography>

    <Box sx={{ pt: '2rem' }}>
      <Slider
        aria-label="Always visible"
        min={0}
        defaultValue={2500}
        max={5000}
        step={10}
        valueLabelDisplay="on"
        sx={{ py: 0 }}
      />
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Typography>0</Typography>
        <Typography>5,000</Typography>
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
        <Button variant="contained" sx={{ textTransform: 'uppercase', fontWeight: 400 }}>
          Submit
        </Button>
      </Box>
    </Box>
    <Box
      sx={{
        background: '#FFFFFF',
        boxShadow: '0px 8px 24px rgba(189, 206, 212, 0.2)',
        borderRadius: '10px',
        width: '31.5rem',
        mt: 2,
      }}
    >
      <FaqQuestions accordData={accordData1} />
    </Box>
  </>
);

export default Gmaps;
