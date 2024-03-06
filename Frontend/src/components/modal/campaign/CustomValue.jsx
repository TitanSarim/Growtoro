import { Box, Button, Modal, Stack, TextField } from '@mui/material';
import { useNotification } from 'context/NotificationContext';
// import { useState } from 'react';
import { PlainText } from '../../../utils/typography';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  maxWidth: 500,
  width: '100%',
  bgcolor: 'background.paper',
  boxShadow: 24,
  borderRadius: 2,
  p: '25px 35px',
};

const CustomValue = ({ isOpen, onSubmit, onClose, custom, setCustom }) => {
  const { sendNotification } = useNotification();

  const submit = (e) => {
    e.preventDefault();
    if (custom.length > 0) onSubmit(custom);
    else
      sendNotification({
        open: true,
        message: 'Field cannot be empty',
        alert: 'error',
      });
  };
  return (
    <>
      <Modal open={isOpen} onClose={onClose}>
        <Box sx={style}>
          <Stack direction="column" justifyContent="center" alignItems="center" spacing={3}>
            <PlainText fontSize="22px" fontWeight="700" color="#333333">
              Custom Variable
            </PlainText>
          </Stack>
          <TextField
            type="text"
            name="campaignName"
            placeholder="Custom variable name"
            variant="outlined"
            value={custom}
            onChange={(e) => setCustom(e.target.value)}
            InputProps={{
              style: {
                height: '40px',
                fontSize: '18px',
              },
            }}
            sx={{ width: '100%', my: 3 }}
          />
          <Stack direction="row" justifyContent="end" alignItems="center" spacing={2}>
            <Button onClick={onClose} variant="text" sx={{ fontSize: '18px' }}>
              Cancel
            </Button>
            <Button
              type="submit"
              onClick={submit}
              variant="contained"
              style={{ textTransform: 'uppercase', fontSize: '16px' }}
            >
              Continue
            </Button>
          </Stack>
        </Box>
      </Modal>
    </>
  );
};

export default CustomValue;
