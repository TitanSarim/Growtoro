import { Typography } from '@mui/material';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import ModalsHeader from '../emails/ModalsHeader';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  maxWidth: 1200,
  width: '100%',
  bgcolor: 'background.paper',
  boxShadow: 24,
  borderRadius: 2,
};

export default function VideoOpen({ isOpen, heading, details, onClose }) {
  return (
    <Modal open={isOpen} onClose={onClose}>
      <Box sx={style}>
        <ModalsHeader title={heading} handleClose={onClose} />
        <iframe
          width="1200"
          height="600"
          style={{ borderRadius: '10px 10px 0px 0px', border: 'none' }}
          src="https://www.youtube.com/embed/V_VUDJ3DW74?autoplay=1"
          title="YouTube video player"
          allow="autoplay"
          allowFullScreen
        />
        <Typography gutterBottom variant="body1" sx={{ p: 2 }}>
          {details}
        </Typography>
      </Box>
    </Modal>
  );
}
