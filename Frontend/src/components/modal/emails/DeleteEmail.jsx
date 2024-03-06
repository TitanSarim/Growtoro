import { Box, Button, Modal, Stack } from '@mui/material';
import { useEmail } from 'context/EmailContext';
// import { useNotification } from 'context/NotificationContext';
import { useUser } from 'context/UserContext';
// import { useEffect, useState } from 'react';
import { PlainText } from 'utils/typography';
import { style } from '../campaign/ConfirmPopup';

const DeleteEmail = ({ isOpen, setOpenModal, onSubmit, onClose }) => {
  const { user } = useUser();
  // const { sendNotification } = useNotification();
  const { deleteEmail, editAble } = useEmail();

  const handleDeleteEmail = () => {
    onSubmit();
    deleteEmail(user?.tenant_id, editAble);
    setOpenModal('');
    onSubmit();
  };
  return (
    <Modal open={isOpen} onClose={onClose}>
      <Box sx={style}>
        <Stack direction="column" justifyContent="center" alignItems="center" spacing={2}>
          <PlainText fontSize="20px" fontWeight="400" color="#333333">
            Are you sure you want to delete this email account?
          </PlainText>
        </Stack>
        <Stack direction="row" justifyContent="center" alignItems="center" spacing={1} mt={4}>
          <Button
            sx={{
              width: '50%',
              color: '#FFFFFF',
              fontSize: '20px',
              fontWeight: 400,
              backgroundColor: '#7B68EE',
            }}
            onClick={handleDeleteEmail}
            variant="contained"
          >
            Delete
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
            Cancel
          </Button>
        </Stack>
      </Box>
    </Modal>
  );
};

export default DeleteEmail;
