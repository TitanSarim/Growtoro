import React, { useState } from 'react';
import { Box, Button, Checkbox, Modal, Stack, Typography } from '@mui/material';
import { PlainText } from 'utils/typography';
import { useNotification } from 'context/NotificationContext';
// import { useNavigate } from 'react-router-dom';
// import { modalType } from '_mock/defines';
import { useCampaign } from 'context/CampaignContext';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  maxWidth: 450,
  width: '100%',
  bgcolor: 'background.paper',
  boxShadow: 24,
  borderRadius: 2,
  p: '25px 15px',
};

const Deliverability = ({ isOpen, onSubmit, onClose }) => {
  const { sendNotification } = useNotification();
  // const navigate = useNavigate();
  const [check, setCheck] = useState(false);
  const { onNewCampaignInputChange } = useCampaign();

  return (
    <Modal open={isOpen} onClose={onClose}>
      <Box sx={style}>
        <Stack direction="column" justifyContent="center" alignItems="center" spacing={2} p="2vh 2vw">
          <PlainText fontSize="18px" fontWeight="700" color="#333333">
            😯Potential Deliverability Issues
          </PlainText>
          <Typography variant="body" color="#333333">
            We noticed you've selected an account that does not have a custom tracking domain.
          </Typography>
          <br />
          <Typography variant="body" color="#333333">
            While you can still run your campaign, we highly recommend using custom tracking domains with all your
            accounts and properly warming them up for the best results.
          </Typography>
          <br />
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
            <Checkbox checked={check} required onClick={() => setCheck(!check)} />
            <Typography variant="body" color="#333333">
              I understand what I'm doing
            </Typography>
          </Box>
        </Stack>
        <Stack direction="row" justifyContent="center" alignItems="center" spacing={1} mt="20px">
          <Button
            onClick={() => {
              onSubmit();
              sendNotification({
                open: true,
                message: 'Campaign Launched',
                alert: 'success',
              });
              onNewCampaignInputChange((prev) => ({ ...prev, status: 1 }));
              onClose();
            }}
            variant="contained"
            disabled={!check}
          >
            Publish
          </Button>

          <Button onClick={onClose} variant="outlined">
            Cancel
          </Button>
        </Stack>
      </Box>
    </Modal>
  );
};

export default Deliverability;
