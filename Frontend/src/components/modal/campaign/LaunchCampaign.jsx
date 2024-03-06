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

const LaunchCampaign = ({ isOpen, onSubmit, onClose }) => {
  const { sendNotification } = useNotification();
  const {
    // updateCamapaignStatus,
    onNewCampaignInputChange,
    // editCampaign,
    createCampaign,
    newCampaign,
    setIsLoading,
    updateCampaign,
    setNewCampaignTab,
  } = useCampaign();
  const { user } = useUser();

  console.log(newCampaign);

  return (
    <Modal open={isOpen} onClose={onClose}>
      <Box sx={style}>
        <Stack direction="column" justifyContent="center" alignItems="center" spacing={3}>
          <PlainText fontSize="22px" fontWeight="700" color="#333333">
            Are you sure?
          </PlainText>
          <PlainText fontSize="20px" fontWeight="400" color="#333333">
            This will publish your campaign.
          </PlainText>
        </Stack>
        <Stack direction="row" justifyContent="center" alignItems="center" spacing={1} mt="25px">
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
            onClick={() => {
              onSubmit();
              if (!newCampaign.time_filter) {
                sendNotification({
                  open: true,
                  message: "Please set the campaign's schedule",
                  alert: 'error',
                });
                setNewCampaignTab("Schedule");
                return
              }
              onNewCampaignInputChange((prev) => ({ ...prev, status: 1 }));
              if (!newCampaign.id) {
                setIsLoading((prev) => ({ ...prev, createLaunchCampaign: true }));
                // console.log(newCampaign);
                createCampaign(user?.tenant_id, {
                  status: 1,
                });
              } else {
                updateCampaign(user?.tenant_id, {
                  status: 1,
                });
              }
            }}
          >
            Publish
          </Button>
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
        </Stack>
      </Box>
    </Modal>
  );
};

export default LaunchCampaign;
