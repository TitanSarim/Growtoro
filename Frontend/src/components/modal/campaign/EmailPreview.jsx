import { Box, Button, Divider, Modal, Stack, TextField, Typography } from '@mui/material';
import DynamicDropdown from 'components/input/DynamicDropdown';
import { useCampaign } from 'context/CampaignContext';
import { useEmail } from 'context/EmailContext';
import { useUser } from 'context/UserContext';
import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  maxWidth: 786,
  width: '100%',
  bgcolor: 'background.paper',
  boxShadow: 24,
  borderRadius: 2,
  px: '30px',
  py: '20px',
};

const EmailPreview = ({ isOpen, setOpenModal, onClose, onChange, allStep }) => {


  const { newCampaign, sendTestEmail, isLoading } = useCampaign();
  const [UserData, setUserData] = useState(null);
  const { user } = useUser();
  const { emails } = useEmail();
  const boxRef = useRef(null);
  const [data, setData] = useState({
    to: '',
    from: '',
  });
  const location = useLocation();


  console.log("newCampaign", newCampaign)

  const Emailpath = location.pathname
  const pathSegments = Emailpath.split('/');
  const lastSegment = pathSegments[pathSegments.length - 1];
  
  useEffect(() => {
  if (lastSegment === 'edit') {
    setUserData(newCampaign?.csvrow || newCampaign?.email_subscribers[0] || null);
  } else if (lastSegment === 'new') {
    setUserData(newCampaign?.email_subscribers[0] || null);
  } 
  }, [newCampaign]);

  const userFullName = user?.user?.name


  const replacePlaceholders = (text, userData) => {
    userData = userData || {};
    const replacedText = (text || "").replace(/{([^}]+)}/g, (match, key) => {
      if (!userData[key]) {
        return `{${key}}`;
      }
      if (key === 'sending_account_full_name') {
        return userData?.[key] || userFullName;
      }
  
      return userData[key] !== undefined ? userData[key] : match;
    });
  
    return replacedText;
  };

  const replacePlaceholdersInStep = (step, userData) => {
    console.log(userData)
    const replacedSubject = replacePlaceholders(step.subject, userData);
    const replacedBody = replacePlaceholders(step.body, userData);

    return { ...step, subject: replacedSubject, body: replacedBody };
  };
  const replacedSteps = allStep.map((step) => replacePlaceholdersInStep(step, UserData));



  const onChangeHandler = (e) => {
    const email = emails.filter((_email) => _email.id === e.target.value);
    if (email[0]) {
      setData((prev) => ({ ...prev, from: email[0].smtp_from_email }));
    }
  };

  useEffect(() => {
    setData((prev) => ({ ...prev, from: newCampaign?.from_email }));
  }, [newCampaign?.from_email]);

  return (
    <Modal open={isOpen} onClose={onClose}>
      <Box sx={style}>
        <Stack direction="row" alignItems="center" mb="10px" >
          <img src="/assets/icons/eye.svg" alt="" style={{ marginRight: '0.5rem', height: '34px', width: '34px' }} />
          <Typography variant="h4">Email preview</Typography>
        </Stack>
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
          <Typography>
            <span style={{ color: '#7C828D', paddingRight: '0.8rem' }}>Send to:</span>
          </Typography>
          <TextField
            value={data.to}
            onChange={(e) => setData((prev) => ({ ...prev, to: e.target.value }))}
            id="standard-basic"
            variant="standard"
            sx={{ flexGrow: 1 }}
            InputProps={{ disableUnderline: true }}
          />
        </Box>
        <Divider />
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
          <Typography>
            <span style={{ color: '#7C828D', paddingRight: '0.8rem' }}>Send from:</span>
          </Typography>
          <Box sx={{ flexGrow: 1, my: 1 }}>
            <DynamicDropdown
              name="email"
              onChangeHandler={onChangeHandler}
              selectItems={emails?.map((data) => ({ id: data?.id, value: data?.smtp_from_email }))}
            />
          </Box>
        </Box>
        <Divider />
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
          <Typography>
            <span style={{ color: '#7C828D', paddingRight: '0.8rem' }}>Subject:</span>
          </Typography>
          <TextField
            id="standard-basic"
            value={replacedSteps.find((step) => step.actives)?.subject || ''}
            onChange={(e) => onChange(e.target.value)}
            variant="standard"
            InputProps={{ disableUnderline: true }}
            sx={{ flexGrow: 1 }}
          />
        </Box>
        <Box
         sx={{
            height: { xs: '20vh', sm: '30vh', md: '40vh', lg: '49vh', xl: '54vh' },
            background: '#F9FAFE',
            overflow: 'auto',
            overflowWrap: 'break-word',  
            wordBreak: 'keep-all',    
            borderRadius: 1,
            py: 1.5,
            px: 1,
            mt: 1,
          }}
          className="simple-email-editor"
          dangerouslySetInnerHTML={{ __html: replacedSteps.find((step) => step.actives)?.body || '' }}
        />
        {/* <EmailEditor value={value} setValue={setValue} /> */}
        <Box sx={{ textAlign: 'end' }}>
          <Button
            variant="contained"
            startIcon={
              isLoading.sendTestEmail ? (
                ''
              ) : (
                <img src="/assets/icons/send2.svg" alt="" style={{ marginRight: '0.5rem' }} />
              )
            }
            onClick={() => {
              const activeStep = replacedSteps.find((step) => step.actives);
              if (activeStep) {
                sendTestEmail(
                  user?.tenant_id,
                  {
                    to_mail: data.to,
                    from_mail: data.from,
                    subject: activeStep.subject,
                    body: activeStep.body,
                  },
                  setOpenModal
                );
              }
              // setOpenModal('');
            }}
            sx={{ mt: 2 }}
            disabled={isLoading.sendTestEmail}
          >
            <Typography variant="body2">{isLoading.sendTestEmail ? 'Loading...' : 'Send test email'}</Typography>
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default EmailPreview;
