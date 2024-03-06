import { useState } from 'react';
import PersonOffIcon from '@mui/icons-material/PersonOff';
import { Box, Checkbox, Modal, Typography, Divider, Button } from '@mui/material';

import Api from 'api/Api';
import ErrorHandling from 'utils/ErrorHandling';
import { useNotification } from 'context/NotificationContext';
import { useUser } from 'context/UserContext';

import 'react-quill/dist/quill.snow.css';

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
  p: '25px 45px',
};

const RemoveLead = (props) => {
  const { isOpen, setOpenModal, onClose, messageDetail } = props;

  const [check, setCheck] = useState([false, true]);
  const { sendNotification } = useNotification();
  const { user } = useUser();

  const submit = () => {
    if (!check[0] && !check[1]) {
      sendNotification({
        open: true,
        message: 'Choose at least one option',
        alert: 'error',
      });

      return;
    }

    Api.unibox
      .removeLead(user?.tenant_id, {
        id: messageDetail.id,
        remove_from_campaign: check[0],
        add_to_block_list: check[1],
      })
      .then((res) => {
        setOpenModal('');
        sendNotification({
          open: true,
          message: res.data.message,
          alert: 'success',
        });
      })
      .catch((e) => ErrorHandling({ e, sendNotification }));
  };

  return (
    <Modal open={isOpen} onClose={onClose}>
      <Box sx={style}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
          <PersonOffIcon fontSize="large" />
          <Typography variant="h3">Remove lead</Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
          <Checkbox
            checked={check[0]}
            onClick={() => setCheck((prev) => [!prev[0], prev[1]])}
            sx={{ padding: '0 !important' }}
          />
          <Typography variant="h5" fontWeight={400}>
            Remove from all campaigns
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
          <Checkbox
            checked={check[1]}
            onClick={() => setCheck((prev) => [prev[0], !prev[1]])}
            size="medium"
            sx={{ padding: '0 !important' }}
          />
          <Typography variant="h5" fontWeight={400}>
            Add to blocklist
          </Typography>
        </Box>
        <Divider />
        <Box sx={{ textAlign: 'center', mt: 4, display: 'flex', gap: 2 }}>
          <Button variant="contained" onClick={submit} fullWidth sx={{ fontSize: '18px' }}>
            Remove
          </Button>
          <Button variant="outlined" onClick={() => setOpenModal(false)} fullWidth sx={{ fontSize: '18px' }}>
            Cancel
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};
export default RemoveLead;
