import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import { Box, Divider, Modal, Stack, Typography } from '@mui/material';
import FaqQuestions from 'pages/CustomLeads/Faq';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  maxWidth: 550,
  width: '100%',
  bgcolor: 'background.paper',
  boxShadow: 24,
  borderRadius: 2,
  p: '25px 60px',
  maxHeight: '90%',
  overflowY: 'auto',
};

const FaqModal = ({ isOpen, setOpen, onClose, accordData }) => (
  <>
    <Modal open={isOpen} onClose={onClose}>
      <Box sx={style}>
        <HighlightOffIcon
          onClick={() => setOpen((prev) => ({ ...prev, openModal: '' }))}
          sx={{ cursor: 'pointer', height: 22, width: 22, display: 'flex', ml: 'auto' }}
        />
        <Stack sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <Typography variant="h3">FAQ</Typography>
        </Stack>
        <Divider sx={{ m: 0 }} />
        <FaqQuestions accordData={accordData} />
      </Box>
    </Modal>
  </>
);

export default FaqModal;
