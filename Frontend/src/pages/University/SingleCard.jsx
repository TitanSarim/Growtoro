import React, { useState } from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import VideoOpen from 'components/modal/university/VideoOpen';
import { Box } from '@mui/material';
import { modalType } from '_mock/defines';

const SingleCard = ({ data }) => {
  const [openModal, setOpenModal] = useState('');
  return (
    <Card>
      <div style={{ position: 'relative' }}>
        <CardMedia sx={{ position: 'relative' }} component="img" alt="green iguana" height="180" image={data.imgPath} />

        <Box onClick={() => setOpenModal('openvideo')}>
          <img
            style={{
              position: 'absolute',
              top: '50%',
              left: '45%',
              cursor: 'pointer',
            }}
            src={data.playIcon}
            alt=""
          />
        </Box>

        <Button
          variant="contained"
          color={data.buttonVariant}
          sx={{
            position: 'absolute',
            bottom: '5%',
            left: '5%',
          }}
        >
          Details
        </Button>
      </div>
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          {data.heading}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {data.details}
        </Typography>
      </CardContent>
      <VideoOpen
        isOpen={openModal === 'openvideo'}
        heading={data.heading}
        details={data.details}
        onClose={() => setOpenModal(modalType.close)}
      />
    </Card>
  );
};

export default SingleCard;
