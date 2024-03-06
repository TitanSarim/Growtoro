import { useState } from 'react';
import { Button, Stack, TextField, Typography } from '@mui/material';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';

import { useNotification } from 'context/NotificationContext';
import ModalsHeader from '../emails/ModalsHeader';

export const styleBox = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  maxWidth: 700,
  width: '100%',
  height: '100%',
  maxHeight: 350,
  bgcolor: 'background.paper',
  boxShadow: 24,
  borderRadius: 2,
  pb: 2,
};

export default function NewCampainModals({ title, placeholder, isOpen, onSubmit, onClose }) {
  const { sendNotification } = useNotification();

  const [campaignName, setCampaignName] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!campaignName) {
      sendNotification({
        open: true,
        message: 'Please provide a name',
        alert: 'error',
      });

      return;
    }

    onSubmit(campaignName);
  };

  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={styleBox}>
        <ModalsHeader
          title={title}
          handleClose={() => {
            onClose();
            setCampaignName('');
          }}
        />
        <Box sx={{ p: '10px 32px 25px' }}>
          <Typography variant="h5" sx={{ mt: 3, mb: 2 }}>
            What would you like to name it?
          </Typography>
          <form onSubmit={handleSubmit}>
            <TextField
              type="text"
              name="campaignName"
              placeholder={placeholder}
              variant="outlined"
              value={campaignName}
              onChange={(e) => setCampaignName(e.target.value)}
              InputProps={{
                style: {
                  height: '95px',
                  fontSize: '34px',
                },
              }}
              style={{ width: '100%' }}
            />
            <Stack direction="row" justifyContent="end" alignItems="center" spacing={2} mt={3}>
              <Button onClick={onClose} variant="text" sx={{ fontSize: '18px' }}>
                Cancel
              </Button>
              <Button type="submit" variant="contained" style={{ textTransform: 'uppercase', fontSize: '16px' }}>
                Continue
              </Button>
            </Stack>
          </form>
        </Box>
      </Box>
    </Modal>
  );
}
