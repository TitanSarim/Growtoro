import { Box, Button, Modal, Stack } from '@mui/material';
import { useCampaign } from 'context/CampaignContext';
import { useNotification } from 'context/NotificationContext';
import { useUser } from 'context/UserContext';
import { PlainText } from 'utils/typography';

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
  p: '25px 35px',
};

const PauseCampaign = ({ isOpen, onSubmit, onClose }) => {
  const { sendNotification } = useNotification();
  const { newCampaign, updateCampaign, setIsLoading } = useCampaign();
  const { user } = useUser();

  return (
    <Modal open={isOpen} onClose={onClose}>
      <Box sx={style}>
        <Stack direction="column" justifyContent="center" alignItems="center" spacing={3}>
          <PlainText fontSize="22px" fontWeight="700" color="#333333">
            Are you sure?
          </PlainText>
          <PlainText fontSize="20px" fontWeight="400" color="#333333">
            This will pause your campaign.
          </PlainText>
        </Stack>
        <Stack direction="row" justifyContent="center" alignItems="center" spacing={1} mt="25px">
          <Button
            onClick={() => {
              setIsLoading((prev) => ({ ...prev, updateLaunchPauseCampaign: true }));
              updateCampaign(user?.tenant_id, {
                id: newCampaign.id,
                status: 0,
              });

              sendNotification({
                open: true,
                message: 'Campaign Paused',
                alert: 'success',
              });

              onSubmit();
            }}
            variant="contained"
            fullWidth
            sx={{
              fontSize: '20px',
              borderRadius: '5px',
              padding: '12px 50px',
              width: '50%',
              color: '#FFFFFF',
              fontWeight: 400,
              backgroundColor: '#FE4D47',
            }}
            type="submit"
          >
            Pause
          </Button>

          <Button
            onClick={onClose}
            variant="outlined"
            fullwidth
            style={{
              width: '50%',
              fontSize: '20px',
              borderRadius: '5px',
              padding: '12px 50px',
              fontWeight: 400,
              color: '#7B68EE',
            }}
          >
            Cancel
          </Button>
        </Stack>
      </Box>
    </Modal>
  );
};

export default PauseCampaign;
