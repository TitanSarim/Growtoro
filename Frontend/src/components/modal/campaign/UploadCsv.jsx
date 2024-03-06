import { useState } from 'react';
import { Box, Button, Modal, Stack } from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';

import { useNotification } from 'context/NotificationContext';
import { PlainText } from '../../../utils/typography';
// import { StyledButton } from '../../button/buttonStyles';
import ModalsHeader from '../emails/ModalsHeader';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  maxWidth: 700,
  width: '100%',
  height: '30em',
  bgcolor: 'background.paper',
  boxShadow: 24,
  borderRadius: 2,
  pb: 2,
};

const UploadCsv = ({ isOpen, onSubmit, onClose, loading }) => {
  const { sendNotification } = useNotification();

  const [file, setFile] = useState(null);

  const handleSubmit = () => {
    if (file) {
      onSubmit(file);
    } else {
      sendNotification({ open: true, message: 'Please select CSV file', alert: 'error' });
    }
  };

  const handleFileChange = (event) => {
    console.log('File selected:', event.target.files[0]);
    setFile(event.target.files[0]);
  };

  return (
    <Modal open={isOpen} onClose={onClose}>
      <Box sx={style}>
        <ModalsHeader
          title="Upload File"
          subHeader="Supported file formats: CSV"
          handleClose={() => {
            onClose();
            setFile(null);
          }}
        />
        <label htmlFor="file">
          <Stack
            sx={{
              alignItems: 'center',
              border: '1px dashed #ccc',
              margin: '1em',
              padding: '1em',
              cursor: 'pointer',
              height: '60%',
            }}
          >
            <img src="/assets/icons/upload.svg" alt="" width="20%" height="60%" />
            <input
              type="file"
              name="file"
              id="file"
              style={{ opacity: '0', visibility: 'hidden', width: '100%' }}
              onChange={handleFileChange}
              onInput={handleFileChange}
            />
            <PlainText fontSize="2em" sx={{ mt: 2, width: '100%!important', wordBreak: 'break-all' }}>
              {file ? file.name : 'Upload CSV'}
            </PlainText>
          </Stack>
        </label>

        <Stack direction="row" justifyContent="end" alignItems="center" spacing={2} style={{ padding: '1em' }}>
          <Button
            onClick={() => {
              onClose();
              setFile(null);
            }}
            variant="text"
            style={{
              fontSize: '1em',
              fontWeight: 400,
              color: '#7B68EE',
              borderRadius: '5px',
              padding: '2em 2em',
            }}
          >
            Cancel
          </Button>
          {/* <StyledButton
            loading
            onClick={handleSubmit}
            style={{
              fontSize: '1em',
              padding: '2em 2em',
            }}
          >loading
            Continue
          </StyledButton> */}

          <LoadingButton loading={loading} variant="contained" onClick={handleSubmit}>
            Continue
          </LoadingButton>
        </Stack>
      </Box>
    </Modal>
  );
};

export default UploadCsv;
