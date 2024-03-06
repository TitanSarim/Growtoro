import { Box, Button, Grid, Modal, Stack } from '@mui/material';
import DynamicInput from 'components/input/DynamicInput';
import { useNotification } from 'context/NotificationContext';
import { useState } from 'react';
import { PlainText } from '../../../utils/typography';
import ModalsHeader from '../emails/ModalsHeader';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '100%',
  maxWidth: 780,
  bgcolor: 'background.paper',
  boxShadow: 24,
  borderRadius: 2,
  pb: 2,
  maxHeight: '90vh',
  overflow: 'auto',
};

const innerStyle = {
  p: '20px 32px 28px',
};

const ManualEmails = ({ isOpen, loading, onSubmit, onClose }) => {
  const { sendNotification } = useNotification();

  const [data, setData] = useState([
    {
      email: '',
      first_name: '',
      last_name: '',
    },
  ]);

  const handleAddMoreRow = () =>
    setData((prev) => [
      ...prev,
      {
        email: '',
        first_name: '',
        last_name: '',
      },
    ]);

  const handleUpdate = (index, key, value) => {
    setData((prev) => prev.map((item, _index) => (index === _index ? { ...item, [key]: value } : item)));
  };

  const handleUpload = (e) => {
    e.preventDefault();

    const hasEmptyFields = data.some((item) => item.email === '' || item.first_name === '' || item.last_name === '');

    if (hasEmptyFields) {
      sendNotification({
        open: true,
        message: 'Fields cannot be empty',
        alert: 'error',
      });
    } else {
      onSubmit(data);
      setData([
        {
          email: '',
          first_name: '',
          last_name: '',
        },
      ]);
    }
  };

  const handleClose = () => {
    setData([
      {
        email: '',
        first_name: '',
        last_name: '',
      },
    ]);
    onClose();
  };

  return (
    <Modal open={isOpen} onClose={handleClose} sx={{ overflow: 'auto' }}>
      <Box sx={style}>
        <ModalsHeader title="Insert Emails Manually" handleClose={onClose} />
        <form onSubmit={handleUpload}>
          <Box sx={innerStyle}>
            <PlainText fontSize="16px" fontWeight="400" textAlign="start">
              You can enter up to 1,000 emails.
            </PlainText>
            <Grid
              container
              sx={{
                pt: '1rem',
                pb: '0.5rem',
                borderBottom: '1px solid rgba(185, 190, 199, 0.6);',
              }}
            >
              <Grid item xs={4}>
                <PlainText textAlign="start" fontSize="14px" fontWeight="700">
                  Email
                </PlainText>
              </Grid>
              <Grid item xs={4}>
                <PlainText textAlign="start" fontSize="14px" fontWeight="700" px="0.9rem">
                  First Name
                </PlainText>
              </Grid>
              <Grid item xs={4}>
                <PlainText textAlign="start" fontSize="14px" fontWeight="700" px="0.9rem">
                  Last Name
                </PlainText>
              </Grid>
            </Grid>
            {data.map((item, index) => (
              <Grid container columnSpacing={3} sx={{ pt: '1rem' }} key={index}>
                <Grid item xs={4}>
                  <DynamicInput
                    type="email"
                    placeholder={'Email address'}
                    value={item.email}
                    updateData={(e) => handleUpdate(index, 'email', e.target.value)}
                  />
                </Grid>
                <Grid item xs={4}>
                  <DynamicInput
                    placeholder={'First name'}
                    value={item.first_name}
                    updateData={(e) => handleUpdate(index, 'first_name', e.target.value)}
                  />
                </Grid>
                <Grid item xs={4}>
                  <DynamicInput
                    placeholder={'Last name'}
                    value={item.last_name}
                    updateData={(e) => handleUpdate(index, 'last_name', e.target.value)}
                  />
                </Grid>
              </Grid>
            ))}
          </Box>
          <Stack direction="column" justifyContent="center" alignItems="center" spacing={2}>
            <PlainText
              fontSize="14px"
              color="#00B783"
              margin="0px 10px"
              sx={{ cursor: 'pointer' }}
              onClick={handleAddMoreRow}
            >
              + ADD MORE ROWS
            </PlainText>
            <Stack direction="row" justifyContent="center" alignItems="center" spacing={2} py={3}>
              <Button
                onClick={onClose}
                variant="text"
                style={{
                  fontSize: '16px',
                  fontWeight: 400,
                  color: '#7B68EE',
                  borderRadius: '5px',
                  padding: '12px 50px',
                }}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                fullWidth
                sx={{
                  width: '100%',
                  color: '#FFFFFF',
                  fontSize: '16px',
                  fontWeight: 400,
                  mt: '8px',
                  backgroundColor: '#7B68EE',
                }}
                type="submit"
                // onClick={handleUpload}
                disabled={loading}
              >
                {loading ? 'Loading...' : 'Upload'}
              </Button>
            </Stack>
          </Stack>
        </form>
      </Box>
    </Modal>
  );
};

export default ManualEmails;
