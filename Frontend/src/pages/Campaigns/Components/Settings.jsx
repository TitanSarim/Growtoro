import { useEffect, useState } from 'react';

import { Stack } from '@mui/system';
import { Autocomplete, Box, Button, Grid, TextField, Typography } from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import PauseIcon from '@mui/icons-material/Pause';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';

import Api from 'api/Api';
import CustomSwitch from 'components/button/CustomSwitch';
import InfoModal from 'components/modal/campaign/InfoModal';
import Deliverability from 'components/modal/campaign/Deliverability';
import PauseCampaign from 'components/modal/campaign/PauseCampaign';
import LaunchCampaign from 'components/modal/campaign/LaunchCampaign';

import { modalType } from '_mock/defines';
import { useUser } from 'context/UserContext';
import { useEmail } from 'context/EmailContext';
import { useCampaign } from 'context/CampaignContext';
import { useNotification } from 'context/NotificationContext';

// import ErrorHandling from 'utils/ErrorHandling';

const Settings = () => {
  const { user } = useUser();
  const { emails } = useEmail();
  const {
    newCampaign,
    onNewCampaignInputChange,
    isLoading,
    setIsLoading,
    // editCampaign,
    createCampaign,
    updateCampaign,
  } = useCampaign();
  const [openModal, setOpenModal] = useState('');
  const [check1, setCheck1] = useState(newCampaign?.tracking === 1);
  const [check2, setCheck2] = useState(newCampaign?.stop_on_reply === 1);

  const { sendNotification } = useNotification();

  const [infoData, setInfoData] = useState();
  const [accorData, setAaccorData] = useState();
  const [open, setOpen] = useState({
    openModal: '',
  });

  const options = emails
    ? emails
        .filter((data) => data?.status === 1)
        .map((data) => ({
          id: data?.id,
          value: data?.smtp_from_email,
        }))
    : [];

  const pauseButton = (
    <Button
      variant="contained"
      // style={{ backgroundColor: '#FE4D47' }}
      color="error"
      startIcon={<PauseIcon sx={{ height: '4vh', width: '4vh' }} />}
      disabled={isLoading.updateLaunchPauseCampaign}
    >
      <Typography variant="h5">Pause</Typography>
    </Button>
  );

  const launchButton = (
    <Button
      variant="contained"
      startIcon={<RocketLaunchIcon sx={{ height: '4vh', width: '4vh' }} />}
      disabled={isLoading.updateLaunchPauseCampaign}
    >
      <Typography variant="h5">Launch</Typography>
    </Button>
  );

  const selectedOptions =
    newCampaign?.smtp_id && options ? options.filter((option) => newCampaign?.smtp_id.includes(option.id)) : [];
  const [selectedIndex, setSelectedIndex] = useState(selectedOptions);

  const onChangeHandler = (newValue) => {
    const filteredArray = newValue.filter((obj, index) => {
      const foundIndex = newValue.findIndex((item) => item.id === obj.id && item.value === obj.value);
      return foundIndex === index;
    });
    setSelectedIndex(filteredArray);
    onNewCampaignInputChange((prev) => ({ ...prev, tracking: check1 ? 1 : 0 }));
    onNewCampaignInputChange((prev) => ({ ...prev, stop_on_reply: check2 ? 1 : 0 }));
    onNewCampaignInputChange((prev) => ({ ...prev, status: 0 }));
  };

  useEffect(() => {
    const x = selectedIndex.map((_item) => _item.id);
    onNewCampaignInputChange((prev) => ({ ...prev, smtp_id: x }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedIndex]);

  useEffect(() => {
    Api.campaign
      .getInstructions(user?.tenant_id)
      .then((res) => {
        setInfoData(res.data.instruction);
      })
      .catch((e) => {
        console.log('e ', e);
        // ErrorHandling({ e, sendNotification });
      });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.tenant_id]);

  const handleSave = () => {
    if (!newCampaign.id) {
      // save campaign
      createCampaign(user?.tenant_id);
    } else {
      // Update Campaign
      updateCampaign(user?.tenant_id, {});
    }
  };

  // handle click on launch/pause button
  const handleClick = () => {
    if (newCampaign?.status === 0 || !newCampaign?.status) {
      if (!newCampaign.max_email || !newCampaign.delay_email) {
        sendNotification({
          open: true,
          alert: 'error',
          message: 'Please fill in the required fields',
        });
        return;
      }
      
      setOpenModal(modalType.LaunchCampaign);
    } else {
      
      setOpenModal(modalType.PauseCampaign);
    }
  };

  const handleOpen = (name, data) => {
    setAaccorData({ name, data });
    setOpen((prev) => ({ ...prev, openModal: 'info' }));
  };

  const checkTracking = () => {
    setCheck1(!check1);
    onNewCampaignInputChange((prev) => ({ ...prev, tracking: check1 ? 0 : 1 }));
  };

  const checkStopOnReply = () => {
    setCheck2(!check2);
    onNewCampaignInputChange((prev) => ({ ...prev, stop_on_reply: check2 ? 0 : 1 }));
  };

  return (
    <Box sx={{ mt: 2, height: '100vh', overflowY: 'auto' }}>
      <Grid container spacing={2} sx={{ width: 1100, m: 'auto' }}>
        {/* left options */}
        <Grid item xs={6}>
          <Typography variant="h6" style={{ display: 'flex', alignItems: 'center' }}>
            E-mail account(s) for sending mails*
            {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions, jsx-a11y/click-events-have-key-events */}
            <span style={{ marginLeft: '5px' }} onClick={() => handleOpen('Sending mails', infoData.sending_mails)}>
              <img src="/assets/images/error.png" height="18px" width="18px" alt="warm" style={{ cursor: 'pointer' }} />
            </span>
          </Typography>

          <Typography>The email account(s) you would love to use for sending emails</Typography>
          <Box sx={{ width: 400, mt: 1, mb: 2 }}>
            <Autocomplete
              id="tags-standard"
              multiple
              getOptionLabel={(option) => option.value}
              options={options}
              filterSelectedOptions={options}
              value={selectedIndex}
              onChange={(e, newValue) => onChangeHandler(newValue)}
              disableClearable
              freeSolo
              sx={{ maxHeight: '250px', overflowY: 'auto', overflowX: 'hidden' }}
              renderInput={(params) => <TextField {...params} placeholder="Select your email" variant="standard" />}
            />
          </Box>
          <Typography variant="h6" style={{ display: 'flex', alignItems: 'center' }}>
            Max emails per day*{' '}
            {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions, jsx-a11y/click-events-have-key-events */}
            <span
              style={{ marginLeft: '5px' }}
              onClick={() => handleOpen('Max email per day', infoData.max_email_per_day)}
            >
              <img src="/assets/images/error.png" height="18px" width="18px" alt="warm" style={{ cursor: 'pointer' }} />
            </span>
          </Typography>
          <Typography>The max number of emails you will send per day</Typography>
          <Stack direction="row" spacing={2} sx={{ display: 'flex', alignItems: 'center', my: 2 }}>
            <TextField
              id="max_email"
              placeholder="7"
              value={newCampaign.max_email}
              onChange={(e) => onNewCampaignInputChange((prev) => ({ ...prev, max_email: e.target.value }))}
              sx={{
                background: '#FFFFFF',
                border: '1px solid rgba(185, 190, 199, 0.6)',
                borderRadius: '5px',
                width: '150px',
              }}
              type="number"
              onBlur={(e) => {
                let value = parseInt(e.target.value, 10);
                if (value > 200) value = 200;
                if (value < 0) value = 0;
                onNewCampaignInputChange((prev) => ({ ...prev, max_email: value }));
              }}
            />
          </Stack>
          <Typography variant="h6" style={{ display: 'flex', alignItems: 'center' }}>
            Delay between sending emails*
            {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions, jsx-a11y/click-events-have-key-events */}
            <span style={{ marginLeft: '5px' }} onClick={() => handleOpen('Delay email', infoData.delay_email)}>
              <img src="/assets/images/error.png" height="18px" width="18px" alt="warm" style={{ cursor: 'pointer' }} />
            </span>
          </Typography>
          <Typography>
            The delay between sending each email. This helps send emails more gradually and avoid mail servers treating
            your emails as spam.
          </Typography>
          <Stack direction="row" spacing={2} sx={{ display: 'flex', alignItems: 'center', my: 2 }}>
            <TextField
              id="delay_email"
              placeholder="7"
              value={newCampaign.delay_email}
              onChange={(e) => onNewCampaignInputChange((prev) => ({ ...prev, delay_email: e.target.value }))}
              sx={{
                background: '#FFFFFF',
                border: '1px solid rgba(185, 190, 199, 0.6)',
                borderRadius: '5px',
                width: '150px',
              }}
              type="number"
              onBlur={(e) => {
                let value = parseInt(e.target.value, 10);
                if (value > 200) value = 200;
                if (value < 3) value = 3;
                onNewCampaignInputChange((prev) => ({ ...prev, delay_email: value }));
              }}
            />
            <span>minutes</span>
          </Stack>
        </Grid>

        {/* right options */}
        <Grid item xs={6}>
          <Typography variant="h6">Enable open tracking</Typography>
          <Typography>Track your email opens</Typography>
          <CustomSwitch checked={check1} onClick={checkTracking} />
          <Typography variant="h6" sx={{ mt: 3 }} style={{ display: 'flex', alignItems: 'center' }}>
            Complete on Reply
            {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions, jsx-a11y/click-events-have-key-events */}
            <span
              style={{ marginLeft: '5px' }}
              onClick={() => handleOpen('Complete on Reply', infoData.complete_on_replay)}
            >
              <img src="/assets/images/error.png" height="18px" width="18px" alt="warm" style={{ cursor: 'pointer' }} />
            </span>
          </Typography>
          <Typography>Stop sending emails to a prospect if a response is received</Typography>
          <CustomSwitch checked={check2} onClick={checkStopOnReply} id="complete_on_reply" />
        </Grid>
      </Grid>

      {/* save/launch */}
      <Grid container spacing={2} sx={{ width: 1100, m: 'auto' }} alignItems={'center'}>
        <Grid item xs={6} textAlign={'end'}>
          <Button
            variant="outlined"
            startIcon={<SaveIcon sx={{ height: '4vh', width: '4vh' }} />}
            sx={{ mr: 2 }}
            onClick={() => {
              if (!newCampaign.max_email || !newCampaign.delay_email) {
                sendNotification({
                  open: true,
                  alert: 'error',
                  message: 'Please fill in the required fields',
                });

                return;
              }

              handleSave();
              setIsLoading((prev) => ({ ...prev, updateCampaign: true }));
            }}
            disabled={isLoading.updateCampaign}
          >
            <Typography variant="h5">{isLoading.updateCampaign ? 'Loading...' : 'Save'}</Typography>
          </Button>
        </Grid>
        <Grid item xs={6} textAlign={'start'}>
          <Box onClick={handleClick} sx={{ ml: 2 }}>
            {newCampaign.status === 0 || !newCampaign.status ? launchButton : pauseButton}
          </Box>
        </Grid>
      </Grid>

      <LaunchCampaign
        isOpen={openModal === modalType.LaunchCampaign}
        setOpenModal={setOpenModal}
        onSubmit={() => {
          setOpenModal('');
        }}
        onClose={() => {
          setOpenModal(modalType.close);
          onNewCampaignInputChange((prev) => ({ ...prev, status: 0 }));
        }}
      />

      <PauseCampaign
        isOpen={openModal === modalType.PauseCampaign}
        setOpenModal={setOpenModal}
        onSubmit={() => {
          setOpenModal('');
        }}
        onClose={() => {
          setOpenModal(modalType.close);
          onNewCampaignInputChange((prev) => ({ ...prev, status: 1 }));
        }}
      />

      <Deliverability
        isOpen={openModal === modalType.Deliverability}
        setOpenModal={setOpenModal}
        onSubmit={() => {
          setOpenModal('');
        }}
        onClose={() => {
          setOpenModal(modalType.close);
        }}
      />
      {accorData && (
        <InfoModal
          isOpen={open.openModal === 'info'}
          setOpen={setOpen}
          onSubmit={() => {}}
          onClose={() => setOpen('')}
          accordData={accorData}
        />
      )}
    </Box>
  );
};

export default Settings;
