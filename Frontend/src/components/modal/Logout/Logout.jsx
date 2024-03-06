import React from 'react';
import { Box, Button, Modal, Stack } from '@mui/material';
import { PlainText } from 'utils/typography';
// import { modalType } from '_mock/defines';
import { useNavigate } from 'react-router-dom';
import { useNotification } from 'context/NotificationContext';
import { useUser } from 'context/UserContext';
import { style } from '../campaign/ConfirmPopup';

const Logout = ({ isOpen, setOpenModal, onClose }) => {
  const { sendNotification } = useNotification();
  const { setUserData, setData } = useUser();
  const navigate = useNavigate();

  const onSubmit = () => {
    localStorage.removeItem('user');
    setUserData(null);
    setData(null);
    sendNotification({
      open: true,
      message: 'Logout Successful',
      alert: 'success',
    });

    navigate('/login');
  };

  return (
    <Modal open={isOpen} onClose={onClose}>
      <Box sx={style}>
        <Stack direction="column" justifyContent="center" alignItems="center" spacing={2}>
          <PlainText fontSize="22px" fontWeight="700" color="#333333">
            Sign Out
          </PlainText>
          <PlainText fontSize="20px" fontWeight="400" color="#333333">
            Are you sure you want to sign out?
          </PlainText>
        </Stack>
        <Stack direction="row" justifyContent="center" alignItems="center" spacing={1} mt="21px">
          <Button
            sx={{
              width: '50%',
              color: '#FFFFFF',
              fontSize: '20px',
              fontWeight: 400,
              backgroundColor: '#7B68EE',
            }}
            onClick={() => {
              onSubmit();
              setOpenModal('');
            }}
            variant="contained"
          >
            Yes
          </Button>

          <Button
            sx={{
              width: '50%',
              fontSize: '20px',
              fontWeight: 400,
              color: '#7B68EE',
              borderRadius: '5px',
              padding: '12px 50px',
            }}
            onClick={onClose}
            variant="outlined"
          >
            No
          </Button>
        </Stack>
      </Box>
    </Modal>
  );
};

export default Logout;
