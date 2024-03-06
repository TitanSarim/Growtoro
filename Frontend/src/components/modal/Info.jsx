import { Box, Modal } from '@mui/material';
// import PayAsYouGo from 'pages/Profile/PayAsYouGo';
// import { useState } from 'react';
import { Link } from 'react-router-dom';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  maxWidth: 700,
  height: 200,
  width: '100%',
  bgcolor: 'background.paper',
  boxShadow: 24,
  borderRadius: 2,
  p: '20px 40px',
  display: 'flex',
  alignItems: 'center',
};

const Info = ({ isOpen, onClose }) => (
  <Modal open={isOpen} onClose={onClose}>
    <Box sx={style}>
      <Box sx={{ fontSize: '25px', lineHeight: 1.5 }}>
        This is your remaining custom lead credits for the month.
        <br />
        <br />
        Need more credits? Please <s />
        <Link to="/profile?tab=4" onClick={onClose}>
          click here.
        </Link>
      </Box>
    </Box>
  </Modal>
);

export default Info;
