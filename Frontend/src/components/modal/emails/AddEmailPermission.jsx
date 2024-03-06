import Box from '@mui/material/Box';

import { Button, Divider, Stack } from '@mui/material';
import Modal from '@mui/material/Modal';
import Typography from '@mui/material/Typography';
import { useNavigate } from 'react-router-dom';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  maxWidth: 560,
  width: '100%',
  bgcolor: 'background.paper',
  boxShadow: 24,
  borderRadius: 2,
  padding: '20px 35px',
};

export default function AddEmailPermission({ isOpen, onClose, emailNumber }) {
  const navigate = useNavigate();

  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <Stack direction="row" justifyContent="center">
          <Typography id="modal-modal-title" variant="h4" component="h2">
            Plan limit reached
          </Typography>
        </Stack>
        <Divider sx={{ mt: 2, mb: 1 }} />

        <Stack direction="column" justifyContent="center">
          <Typography
            variant="body1"
            sx={{
              fontFamily: 'Inter',
              fontStyle: 'normal',
              fontWeight: 400,
              fontSize: '16px',
              // padding: '22px 0px',
            }}
          >
            Your current plan only allows up to {emailNumber} contacts.
            <br />
            <br />
            Please consider upgrading your plan to upload more contacts.
          </Typography>
        </Stack>
        <Stack direction="row" justifyContent="center" alignItems="center" spacing={1} mt={4}>
          <Button
            type="submit"
            variant="contained"
            style={{ textTransform: 'uppercase', fontSize: '16px' }}
            onClick={() => navigate('/profile?tab=3')}
          >
            Upgrade plan
          </Button>

          <Button variant="text" sx={{ fontSize: '18px' }} onClick={onClose}>
            Cancel
          </Button>
        </Stack>
      </Box>
    </Modal>
  );
}
