import React from 'react';
import { Box, Button, Modal, Stack } from '@mui/material';
import { PlainText } from 'utils/typography';
// import { modalType } from '_mock/defines';
// import { useNavigate } from 'react-router-dom';
// import { useNotification } from 'context/NotificationContext';
import { style } from './ConfirmPopup';

const DeleteModal = ({ isOpen, name, onClose, setOpenModal, onSubmit }) => 
  // const { sendNotification } = useNotification();

   (
    <Modal open={isOpen} onClose={onClose}>
      <Box sx={style}>
        <Stack direction="column" justifyContent="center" alignItems="center" spacing={2}>
          <PlainText fontSize="22px" fontWeight="700" color="#333333">
            Delete
          </PlainText>
          <PlainText fontSize="20px" fontWeight="400" color="#333333">
            Are you sure you want to delete {name}?{' '}
          </PlainText>
        </Stack>
        <Stack direction="row" justifyContent="center" alignItems="center" spacing={1} mt={2}>
          <Button
            sx={{
              fontSize: '20px',
              borderRadius: '5px',
              padding: '12px 50px',
              width: '50%',
              color: '#FFFFFF',
              fontWeight: 400,
            }}
            onClick={() => {
              onSubmit();
              setOpenModal('');
            }}
            variant="contained"
          >
            Delete
          </Button>

          <Button
            style={{
              width: '50%',
              fontSize: '20px',
              borderRadius: '5px',
              padding: '12px 50px',
              fontWeight: 400,
              color: '#7B68EE',
            }}
            onClick={onClose}
            variant="outlined"
          >
            Cancel
          </Button>
        </Stack>
      </Box>
    </Modal>
  )
;

export default DeleteModal;
