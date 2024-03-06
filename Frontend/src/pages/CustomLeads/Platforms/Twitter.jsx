import React from 'react';
// eslint-disable-next-line import/named
import { accordData2 } from '_mock/cusomleads';
import { Box, Button, Slider, TextField, Typography } from '@mui/material';
import FaqQuestions from '../Faq';

const Twitter = () => (
  <>
    <Typography variant="h6">Audiences</Typography>
    <Typography sx={{ pt: '0.2rem' }}>Enter the exact @accounts or #hashtags you want emails from</Typography>
    <Typography pb={2}> (Separated by comma)</Typography>
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
            <FaqQuestions accordData={accordData2}/>
        </Box>
  </>
);

export default Twitter;
