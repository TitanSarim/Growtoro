import { Box, Button, Modal, Stack } from '@mui/material';
import { PlainText } from '../../../utils/typography';

export const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  maxWidth: 500,
  width: '100%',
  bgcolor: 'background.paper',
  boxShadow: 24,
  borderRadius: 2,
  p: '25px 35px',
};

const ConfirmPopup = ({ isOpen, name, loading, data, onSubmit, onClose }) => {

  console.log("data", data);

  return(
    <Modal open={isOpen} onClose={onClose}>
      <Box sx={style}>
        <Stack direction="column" justifyContent="center" alignItems="center" spacing={3}>
          <PlainText fontSize="22px" fontWeight="700" color="#333333">
            Are you sure?
          </PlainText>
          <PlainText fontSize="20px" fontWeight="400" color="#333333">
            This will upload {data?.data?.length} contacts to your {name}.
          </PlainText>
        </Stack>
        <Stack direction="row" justifyContent="end" alignItems="center" spacing={1} mt="25px">
          <Button
            variant="outlined"
            onClick={onClose}
            style={{
              width: '50%',
              fontSize: '20px',
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
            sx={{
              width: '50%',
              color: '#FFFFFF',
              fontSize: '20px',
              fontWeight: 400,
              backgroundColor: '#7B68EE',
            }}
            type="submit"
            onClick={onSubmit}
            disabled={loading}
          >
            {loading ? 'Loading...' : 'Upload'}
            {/* Upload */}
          </Button>
        </Stack>
      </Box>
    </Modal>
  )
};

export default ConfirmPopup;
