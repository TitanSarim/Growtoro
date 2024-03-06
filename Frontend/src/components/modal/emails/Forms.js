import { memo, useEffect, useState } from 'react';
import { makeStyles } from '@mui/styles';
import { Box, Button, Grid, Modal, Stack, Switch, Typography } from '@mui/material';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';

import Api from 'api/Api';

import { useEmail } from 'context/EmailContext';
import { useNotification } from 'context/NotificationContext';
import { useUser } from 'context/UserContext';
import ErrorHandling from 'utils/ErrorHandling';
import DynamicInput from '../../input/DynamicInput';
import SmptDetailsModal from './SmptDetailsModal';
import ImapDetailsModal from './ImapDetailsModal';

const useStyles = makeStyles(() => ({
  button: {
    textTransform: 'none', // Set textTransform to 'none' to prevent uppercase
  },
}));

const label = { inputProps: { 'aria-label': 'Switch demo' } };

function Forms({ onClose, onBack, onSubmit, setOpenModal }) {
  const classes = useStyles();
  const { user } = useUser();
  const { sendNotification } = useNotification();
  const { setEditAble, editAble, emails, getAllEmails } = useEmail();

  const [info, setInfo] = useState({
    tenant_id: user?.tenant_id,
    smtp_from_email: '',
    smtp_first_name: '',
    smtp_last_name: '',

    smtp_host_name: '',
    // smtp_user_name: '',
    smtp_password: '',
    smtp_port: '',
    imap_host_name: '',

    // imap_password: 'jhdU$129EPR4Xu^tEH',
    // imap_port: '993',
  });
  const [loadButton, setLoadButton] = useState(false);
  const [openYTModal, setOpenYTModal] = useState({
    smtp: false,
    imap: false,
    url: '',
  });
  const [switchButton, setSwitch] = useState(false);

  const [openModalDetails, setOpenModalDetails] = useState({
    isOpen: false,
    smtp: false,
    imap: false,
    data: {},
  });

  const handleSubmit = async () => {
    setLoadButton(true);
    if (editAble) {
      Api.email
        .updateEmailAccount(user.tenant_id, info)
        .then((res) => {
          sendNotification({
            open: true,
            message: res.data.message,
            alert: 'success',
          });
          onClose();
          getAllEmails(user.tenant_id);
        })
        .catch((e) => {
          ErrorHandling({ e, sendNotification });
        })
        .finally(() => {
          setLoadButton(false);
        });
    } else {

      const isEmailExist = emails.find((email) => email.smtp_from_email === info.smtp_from_email);

      if (isEmailExist) {
        sendNotification({
          open: true,
          message: 'Email already exist',
          alert: 'error',
        });
        setLoadButton(false);
        return;
      }

      Api.email
        .createEmailAccount(user.tenant_id, info)
        .then((res) => {
          // console.log(res);
          onClose();
          onSubmit({
            permission: res.data.permission,
            email_limit: res.data.email_limit,
          });

          if (res.data?.permission === 0) {
            setOpenModal('Permission');
            return;
          }

          sendNotification({
            open: true,
            message: res.data.message || 'Email account created successfully',
            alert: 'success',
          });
          getAllEmails(user.tenant_id);
        })
        .catch((e) => {
          console.log(e);
          ErrorHandling({ e, sendNotification });
        })
        .finally(() => {
          setLoadButton(false);
        });
    }
  };

  useEffect(() => {
    if (editAble) {
      const data = emails.filter((email) => email.id === editAble);
      setInfo({ ...data[0] });
    }
  }, [editAble, emails]);

  useEffect(() => {
    Api.campaign
      .getInstructions(user?.tenant_id)
      .then((res) => {
        setOpenModalDetails((prev) => ({ ...prev, data: res?.data }));
      })
      .catch((e) => {
        ErrorHandling({ e, sendNotification });
      });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.tenant_id]);

  const updateData = (e) => {
    const { name, value } = e.target;
    setInfo({ ...info, [name]: value });
  };

  const handleBack = () => {
    // clear from
    onBack();
    setEditAble();
  };

  const handleSwitch = () => {
    setSwitch(!switchButton);
    if (!switchButton) {
      setInfo({
        ...info,
        imap_user_name: info.smtp_user_name,
        imap_password: info.smtp_password,
      });
    }
  };

  const handleOnClickIcon = (e) => {
    if (e === 'SMTP Details') {
      setOpenModalDetails((prev) => ({ ...prev, smtp: true }));
    }

    if (e === 'IMAP Details') {
      setOpenModalDetails((prev) => ({ ...prev, imap: true }));
    }
  };

  return (
    <>
      <Grid container spacing={1}>
        <Grid item xs={12} mt={2}>
          <Header
            title="SMTP Details"
            setOpenYTModal={setOpenYTModal}
            onClickIcon={handleOnClickIcon}
            onClickYoutubeIcon={() => {
              setOpenYTModal((prev) => ({
                ...prev,
                isOpen: true,
                url: openModalDetails?.data?.instruction?.smtp_details_video,
              }));
            }}
          />
        </Grid>

        <Grid item xs={12}>
          <DynamicInput
            label="First Name*"
            placeholder="ex. John"
            name="smtp_first_name"
            value={info.smtp_first_name}
            updateData={updateData}
          />

          <DynamicInput
            label="Last Name*"
            placeholder="ex. Doe"
            name="smtp_last_name"
            value={info.smtp_last_name}
            updateData={updateData}
          />
        </Grid>
        <Grid item xs={12}>
          <DynamicInput
            label="Email Address*"
            placeholder="ex.johndoe@aol.com"
            type="email"
            name="smtp_from_email"
            value={info.smtp_from_email}
            updateData={updateData}
          />
        </Grid>
        <Grid item xs={12}>
          <DynamicInput
            label="Username*"
            placeholder="ex.johndoe@aol.com"
            type="email"
            name="smtp_user_name"
            value={info.smtp_user_name}
            updateData={updateData}
          />
        </Grid>
        <Grid item xs={12}>
          <DynamicInput
            label="Password*"
            placeholder="Password"
            type="password"
            name="smtp_password"
            value={info.smtp_password}
            updateData={updateData}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <DynamicInput
            label="SMTP Host*"
            placeholder="smtp.website.com"
            name="smtp_host_name"
            value={info.smtp_host_name}
            updateData={updateData}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <DynamicInput
            label="SMTP Port*"
            placeholder="000"
            type="number"
            name="smtp_port"
            value={info.smtp_port}
            updateData={updateData}
          />
        </Grid>
        <Grid item xs={12} mt={2}>
          <Header
            title="IMAP Details"
            setOpenYTModal={setOpenYTModal}
            onClickIcon={handleOnClickIcon}
            onClickYoutubeIcon={() => {
              setOpenYTModal((prev) => ({
                ...prev,
                isOpen: true,
                url: openModalDetails?.data?.instruction?.imap_details_video,
              }));
            }}
          />
        </Grid>
        <Grid item xs={12}>
          <Stack direction="row" alignItems="center">
            <Switch {...label} sx={{ color: '#00B783' }} checked={switchButton} onClick={handleSwitch} />
            <Typography
              variant="body1"
              sx={{
                fontFamily: 'Inter',
                fontStyle: 'normal',
                fontWeight: 400,
                fontSize: '16px',
              }}
            >
              Use the same email address and password from SMTP
            </Typography>
          </Stack>
        </Grid>

        <Grid item xs={12}>
          <DynamicInput
            label="Username*"
            placeholder="ex.johndoe@aol.com"
            type="email"
            name="imap_user_name"
            value={info.imap_user_name}
            updateData={updateData}
          />
        </Grid>

        <Grid item xs={12}>
          <DynamicInput
            label="Password*"
            placeholder="Password"
            type="password"
            name="imap_password"
            value={info.imap_password}
            updateData={updateData}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <DynamicInput
            label="IMAP Host*"
            placeholder="imap.website.com"
            name="imap_host_name"
            value={info.imap_host_name}
            updateData={updateData}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <DynamicInput
            label="IMAP Port*"
            placeholder="000"
            type="number"
            name="imap_port"
            value={info.imap_port}
            updateData={updateData}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          {/* <SubmitButton fill="true" handleBack={handleBack} handleSubmit={handleSubmit} /> */}
          <Button
            variant="outlined"
            startIcon={<NavigateBeforeIcon />}
            onClick={handleBack}
            sx={{
              width: '100%',

              color: '#7B68EE',
              fontSize: '16px',
              fontWeight: 400,
              mt: '8px',
            }}
          >
            Back
          </Button>
        </Grid>

        <Grid item xs={12} md={6}>
          <Button
            className={classes.button}
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
            onClick={handleSubmit}
            disabled={loadButton}
          >
            {loadButton ? 'Loading...' : 'Connect and Save'}
          </Button>
        </Grid>
      </Grid>

      <SmptDetailsModal
        isOpen={openModalDetails.smtp}
        setOpenModalDetails={setOpenModalDetails}
        data={openModalDetails.data}
        title="SMTP Details"
      />

      <ImapDetailsModal
        isOpen={openModalDetails.imap}
        setOpenModalDetails={setOpenModalDetails}
        data={openModalDetails.data}
        title="IMAP Details"
      />

      <VideoPlayer
        data={openModalDetails.data}
        title={openModalDetails.title}
        isOpen={openYTModal.isOpen}
        onClose={() => setOpenYTModal(false)}
        url={openYTModal.url}
      />
    </>
  );
}

export default memo(Forms);

function Header({ title, onClickIcon, onClickYoutubeIcon }) {
  return (
    <Stack direction="row" alignItems="center" spacing={2}>
      <Typography
        variant="body1"
        sx={{
          fontFamily: 'Inter',
          fontStyle: 'normal',
          fontWeight: 700,
          fontSize: '16px',
          lineHeight: '19px',
        }}
      >
        {title}
      </Typography>
      {/* eslint-disable-next-line react/jsx-no-comment-textnodes, jsx-a11y/click-events-have-key-events */}
      <div
        onClick={onClickYoutubeIcon}
        // onKeyPress={() => setOpenYTModal(true)}
        role="button"
        tabIndex="0"
        style={{ cursor: 'pointer' }}
      >
        <img src="/assets/images/youtube.png" height="29px" width="29px" alt="warm" />
      </div>
      {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions */}
      <div onClick={() => onClickIcon(title)} style={{ cursor: 'pointer' }}>
        {/* <a href="https://www.google.com" target="_blank" rel="noopener noreferrer"> */}
        <img src="/assets/images/error.png" height="24px" width="24px" alt="warm" />
        {/* </a> */}
      </div>
    </Stack>
  );
}

const VideoPlayer = ({ isOpen, onClose, url }) => (
  <Modal open={isOpen} onClose={onClose}>
    <Box
      sx={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        bgcolor: 'background.paper',
        boxShadow: 24,
        borderRadius: 2,
        overflow: 'auto',
        display: 'block',
        padding: 0,
      }}
    >
      {/* <iframe
        width="1200"
        height="600"
        style={{ borderRadius: '10px 10px 0px 0px', border: 'none' }}
        src={`https://www.youtube.com/embed/watch?v=${youtubeIdFromUrl(url)}`}
        title="YouTube video player"
        allow="autoplay"
        allowfullscreen
      /> */}

      <iframe
        width="1200"
        height="600"
        src={youtubeUrlToIframeSrc(url)}
        title="YouTube video player"
        allow="autoplay"
        allowFullScreen
      />
    </Box>
  </Modal>
);

function youtubeUrlToIframeSrc(url) {
  const { v } = parseQueryParameters(url);
  return `https://www.youtube.com/embed/${v}`;
}

function parseQueryParameters(url) {
  // Extract the query string from the URL
  const queryString = url?.split('?')[1];

  if (!queryString) {
    return {}; // Return an empty object if no query string
  }

  const urlParams = new URLSearchParams(queryString);
  const parsedParams = {};

  urlParams.forEach((value, key) => {
    parsedParams[key] = value;
  });

  return parsedParams;
}
