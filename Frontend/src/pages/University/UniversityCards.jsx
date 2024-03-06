import { Box, Grid } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import React, { useState } from 'react';
import img1 from '../../assets/university/1.png';
import img2 from '../../assets/university/2.png';
import img3 from '../../assets/university/3.png';
import img4 from '../../assets/university/4.png';
import img5 from '../../assets/university/5.png';
import img6 from '../../assets/university/6.png';
import img7 from '../../assets/university/7.png';
import img8 from '../../assets/university/8.png';
import playIcon from '../../assets/university/play icon.png';
import SingleCard from './SingleCard';

const universityData = [
  {
    heading: 'Adding an email address',
    details:
      'In this tutorial session we are going to show you how to link your email address into your automailer account for sending',
    imgPath: img1,
    playIcon,
    buttonVariant: 'info',
  },
  {
    heading: 'Changing daily sent limit',
    details:
      'In this tutorial session we are going to show you how to link your email address into your automailer account for sending',
    imgPath: img2,
    playIcon,
    buttonVariant: 'info',
  },
  {
    heading: 'Uploading a list',
    details:
      'In this tutorial session we are going to show you how to link your email address into your automailer account for sending',
    imgPath: img3,
    playIcon,
    buttonVariant: 'success',
  },
  {
    heading: 'Creating an email template',
    details:
      'In this tutorial session we are going to show you how to link your email address into your automailer account for sending',
    imgPath: img4,
    playIcon,
    buttonVariant: 'warning',
  },
  {
    heading: 'Creating an email template',
    details:
      'In this tutorial session we are going to show you how to link your email address into your automailer account for sending',
    imgPath: img5,
    playIcon,
    buttonVariant: 'warning',
  },
  {
    heading: 'Changing daily sent limit',
    details:
      'In this tutorial session we are going to show you how to link your email address into your automailer account for sending',
    imgPath: img6,
    playIcon,
    buttonVariant: 'primary',
  },
  {
    heading: 'Changing daily sent limit',
    details:
      'In this tutorial session we are going to show you how to link your email address into your automailer account for sending',
    imgPath: img7,
    playIcon,
    buttonVariant: 'info',
  },
  {
    heading: 'Changing daily sent limit',
    details:
      'In this tutorial session we are going to show you how to link your email address into your automailer account for sending',
    imgPath: img8,
    playIcon,
    buttonVariant: 'info',
  },
];
const newArray = [
  {
    heading: 'Creating an email template',
    details:
      'In this tutorial session we are going to show you how to link your email address into your automailer account for sending',
    imgPath: img5,
    playIcon,
    buttonVariant: 'warning',
  },
  {
    heading: 'Changing daily sent limit',
    details:
      'In this tutorial session we are going to show you how to link your email address into your automailer account for sending',
    imgPath: img6,
    playIcon,
    buttonVariant: 'primary',
  },
  {
    heading: 'Changing daily sent limit',
    details:
      'In this tutorial session we are going to show you how to link your email address into your automailer account for sending',
    imgPath: img7,
    playIcon,
    buttonVariant: 'info',
  },
  {
    heading: 'Changing daily sent limit',
    details:
      'In this tutorial session we are going to show you how to link your email address into your automailer account for sending',
    imgPath: img8,
    playIcon,
    buttonVariant: 'info',
  },
];

const UniversityCards = () => {
  const [cardsArray, setCardsArray] = useState(universityData);
  const [loading, setLoading] = useState(false);

  const loadMore = () => {
    setLoading(true);

    const loadData = setTimeout(() => {
      setCardsArray([...cardsArray, ...newArray]);
      setLoading(false);
    }, 1000);
    return () => loadData();
  };
  return (
    <Box sx={{ marginTop: 1, height: '77vh', overflow: 'auto' }}>
      <Grid container spacing={4}>
        {cardsArray.map((data, index) => (
          <Grid item xs={6} md={4} xl={3} key={index}>
            <SingleCard data={data} />
          </Grid>
        ))}
      </Grid>

      <Box sx={{ textAlign: 'center', my: 3 }}>
        <LoadingButton loading={loading} variant="contained" onClick={loadMore}>
          Show More
        </LoadingButton>
      </Box>
    </Box>
  );
};

export default UniversityCards;
