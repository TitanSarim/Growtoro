import { Box, Button, Modal, Stack, TextField, Typography } from '@mui/material';
import { useNotification } from 'context/NotificationContext';

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
};

const LinkModal = ({ isOpen, onSubmit, onClose, link, setLink, text, setText }) => {
  const { sendNotification } = useNotification();
  const submit = (e) => {
    e.preventDefault();
    if (link.length > 0) {
      onSubmit(text, link);
      onClose();
    } else
      sendNotification({
        open: true,
        message: 'Field cannot be empty',
        alert: 'error',
      });
  };
  return (
    <>
      <Modal open={isOpen} onClose={onClose}>
        <Box sx={style}>
          <Typography fontSize="22px" fontWeight="700" color="#333333">
            Add Link
          </Typography>
          <Typography mt={2} fontSize="20px">
            Display as
          </Typography>
          <TextField
            type="text"
            placeholder="Provide the text"
            variant="standard"
            value={text}
            onChange={(e) => setText(e.target.value)}
            InputProps={{
              style: {
                height: '40px',
                fontSize: '18px',
              },
            }}
            sx={{ width: '100%', mt: 2 }}
          />
          {link !== '#unsubscribe' ? (
            <>
              <Typography mt={5} fontSize="20px">
                Web Address(URL)
              </Typography>
              <TextField
                type="text"
                placeholder="Provide the URL"
                variant="standard"
                value={link}
                onChange={(e) => setLink(e.target.value)}
                InputProps={{
                  style: {
                    height: '40px',
                    fontSize: '18px',
                  },
                }}
                sx={{ width: '100%', my: 2 }}
              />
            </>
          ) : (
            ''
          )}
          <Stack direction="row" justifyContent="end" alignItems="center" spacing={2} mt={1}>
            <Button onClick={onClose} variant="text" sx={{ fontSize: '18px' }}>
              Cancel
            </Button>
            <Button
              type="submit"
              onClick={submit}
              variant="contained"
              style={{ textTransform: 'uppercase', fontSize: '16px' }}
            >
              Continue
            </Button>
          </Stack>
        </Box>
      </Modal>
    </>
  );
};

export default LinkModal;
