import React from 'react';
import { Dialog, DialogActions, DialogContent, DialogContentText, Button } from '@mui/material';
import ModalsHeader from './ModalsHeader';

export default function ImapDetailsModal({ setOpenModalDetails, isOpen, data, title }) {
  const { instruction } = data;

  const handleClose = () => {
    setOpenModalDetails((prev) => ({ ...prev, imap: false }));
  };

  return (
    <Dialog
      open={isOpen}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <ModalsHeader title={title} handleClose={handleClose} />
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          <p
            // eslint-disable-next-line react/no-danger
            dangerouslySetInnerHTML={{
              __html: instruction?.imap_details,
            }}
          />
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        {/* <Button onClick={handleClose} variant="outlined"> */}
        {/* OK
        </Button> */}
        <Button onClick={handleClose} variant="contained" autoFocus>
          OK
        </Button>
      </DialogActions>
    </Dialog>
  );
}
