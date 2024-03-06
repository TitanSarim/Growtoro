import * as React from 'react';
import Box from '@mui/material/Box';

import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import { Divider, Stack } from '@mui/material';

import AccountType from './AccountType';
// import { AddButton } from '../../button/buttons';

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
};

export default function AddEmailModals({ isOpen, onSubmit, onClose }) {
  return (
    <div>
      <Modal
        open={isOpen}
        onClose={onClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Stack direction="row" justifyContent="space-between" p="25px 32px">
            <Typography id="modal-modal-title" variant="h4" component="h2">
              Select Account Type
            </Typography>
            <HighlightOffIcon onClick={onClose} />
          </Stack>
          <Divider sx={{ m: 0 }} />

          <Stack direction="column" justifyContent="space-between" p="0px  32px 25px">
            <Typography
              variant="body1"
              sx={{
                fontFamily: 'Inter',
                fontStyle: 'normal',
                fontWeight: 400,
                fontSize: '16px',
                padding: '22px 0px',
              }}
            >
              Connect your email account for outbound campaigns.
            </Typography>
            <Typography id="modal-modal-title" variant="h4" component="h2">
              Select the email service you use
            </Typography>
          </Stack>
          <Stack direction="row" justifyContent="space-between" p="0px  32px 25px" spacing="20px">
            <AccountType
              imageSource="/assets/images/search.png"
              title="Google"
              details="Gmail and Google Workspace"
              onClick={onSubmit}
            />
            <AccountType
              imageSource="/assets/images/ms.png"
              title="Microsoft"
              details="Exchange, 0365, Outlook and Hotmail"
              onClick={onSubmit}
            />
            <AccountType
              imageSource="/assets/images/box.png"
              title="SMTP/IMAP"
              details="Connect any email provider"
              onClick={onSubmit}
            />
          </Stack>
        </Box>
      </Modal>
    </div>
  );
}
