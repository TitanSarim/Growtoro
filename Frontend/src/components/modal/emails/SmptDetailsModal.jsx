import React from 'react';
import { Dialog, DialogActions, DialogContent, DialogContentText, Button } from '@mui/material';
import ModalsHeader from './ModalsHeader';

export default function SmptDetailsModal({ setOpenModalDetails, isOpen, data, title }) {
  const { instruction } = data;

  const handleClose = () => {
    setOpenModalDetails((prev) => ({ ...prev, smtp: false }));
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
              __html: instruction?.smtp_details,
            }}
          />
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        {/* <Button onClick={handleClose} variant="outlined">
          Disagree
        </Button>
        <Button onClick={() => {}} variant="contained" autoFocus>
          Agree
        </Button> */}

        <Button onClick={handleClose} variant="contained" autoFocus>
          OK
        </Button>
      </DialogActions>
    </Dialog>
  );
}
