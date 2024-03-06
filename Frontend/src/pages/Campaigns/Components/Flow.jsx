import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import _debounce from 'lodash/debounce'
import DeleteIcon from '@mui/icons-material/Delete';
import {
  Box,
  Button,
  Divider,
  Grid,
  IconButton,
  InputBase,
  MenuItem,
  Paper,
  Select,
  TextField,
  Typography,
  useTheme,
} from '@mui/material';

import { modalType } from '_mock/defines';
import ConfirmSaveTemplate from 'components/modal/campaign/ConfirmSaveTemplate';
import EmailPreview from 'components/modal/campaign/EmailPreview';
import EmailTemplates from 'components/modal/campaign/EmailTemplates';
import TextEditor from 'components/modal/campaign/TextEdit/TextEditor';

import { useCampaign } from 'context/CampaignContext';
import { useNotification } from 'context/NotificationContext';
import { useTemplate } from 'context/TemplateContext';
import { useUser } from 'context/UserContext';

const Flow = () => {
  const { user } = useUser();

  const subjectRef = useRef();
  const { typeData, onNewCampaignInputChange, newCampaign, updateCampaignFlow } = useCampaign();

  const theme = useTheme();
  const location = useLocation();

  const updateLocation = location.pathname
  const updateLocationPath = updateLocation.substring(updateLocation.lastIndexOf('/') + 1);
  console.log("updateLocationPath", updateLocationPath)

  const { createTemplate, message } = useTemplate();

  const [openModal, setOpenModal] = useState('');
 // const [compaignData, setCompaignData] = useState([])
  const { sendNotification } = useNotification();

  // get all steps
  const newArray = useMemo(
    () =>
      newCampaign?.sequences?.map((item, index) => ({
        _id: item.id,
        s_id: index + 1,
        subject: item.sq_subject,
        body: item.sq_body,
        waitFor: item.wait_time,
        actives: index === 0,
      })),
    [newCampaign?.sequences]
  );

  const [allStep, setStep] = useState(
    newArray ?? [
      {
        _id: null,
        s_id: 1,
        subject: '',
        body: '',
        waitFor: 0,
        actives: true,
      },
    ]
  );


  console.log("typeData", typeData)
  
const handleSave = () => {
    const step = allStep[0];
    onNewCampaignInputChange((prev) => ({ ...prev, subject: step.subject, email_body: step.body }));
    const newArray = allStep.map((step) => ({
      id: step._id,
      sq_id: step.s_id,
      sq_subject: step.subject,
      sq_body: step.body,
      wait_time: step.waitFor,
    }));
    onNewCampaignInputChange((prev) => ({ ...prev, sequences: newArray }));
    const validationErrors = {};
    if (!step.subject) {
      validationErrors.subject = 'Subject is required';
      sendNotification({
        open: true,
        message: validationErrors.subject,
        alert: 'error',
      });
    }
    if (!step.body || step.body === '<p><br></p>') {
      validationErrors.email_body = 'Email body is required';
      sendNotification({
        open: true,
        message: validationErrors.email_body,
        alert: 'error',
      });
    }
    if (Object.keys(validationErrors).length === 0) {
      const path = location.pathname;
      const lastPart = path.substring(path.lastIndexOf('/') + 1);

      if (lastPart === 'new') {
        // save campaign
        sendNotification({
          open: true,
          message: 'Campaign Saved',
          alert: 'success',
        });
      } 
    }
  };



const handleUpdateSave = () => {  
      const step = allStep[0];
      onNewCampaignInputChange((prev) => ({ ...prev, subject: step.subject, email_body: step.body }));
      const newArray = allStep.map((step) => ({
        id: step._id,
        sq_id: step.s_id,
        sq_subject: step.subject,
        sq_body: step.body,
        wait_time: step.waitFor,
      }));
      onNewCampaignInputChange((prev) => ({ ...prev, sequences: newArray }));
      const validationErrors = {};
      if (!step.subject) {
        validationErrors.subject = 'Subject is required';
        sendNotification({
          open: true,
          message: validationErrors.subject,
          alert: 'error',
        });
      }
      if (!step.body || step.body === '<p><br></p>') {
        validationErrors.email_body = 'Email body is required';
        sendNotification({
          open: true,
          message: validationErrors.email_body,
          alert: 'error',
        });
      }
      if (Object.keys(validationErrors).length === 0) {
          // Update Campaign
          updateCampaignFlow(user?.tenant_id, newArray)
          // window.location.reload()

        }
  };
  

  const handleAutoSave = () => {
    const step = allStep[0];
    if (!step) return;
    onNewCampaignInputChange((prev) => ({ ...prev, subject: step.subject, email_body: step.body }));
    const newArray = allStep.map((step) => ({
      id: step._id,
      sq_id: step.s_id,
      sq_subject: step.subject,
      sq_body: step.body,
      wait_time: step.waitFor,
    }));
    onNewCampaignInputChange((prev) => ({ ...prev, sequences: newArray }));
    const validationErrors = {};
    if (!step.subject) {
      validationErrors.subject = 'Subject is required';
      // sendNotification({
      //   open: true,
      //   message: validationErrors.subject,
      //   alert: 'error',
      // });
    }
    if (!step.body || step.body === '<p><br></p>') {
      validationErrors.email_body = 'Email body is required';
      // sendNotification({
      //   open: true,
      //   message: validationErrors.email_body,
      //   alert: 'error',
      // });
    }
    if (Object.keys(validationErrors).length === 0) {
      const path = location.pathname;
      const lastPart = path.substring(path.lastIndexOf('/') + 1);
      console.log("lastPart", lastPart)
    }
  };

  const handleTemplateName = (_name) => {
    const activeStep = allStep.find((step) => step.actives);
    const info = {
      name: _name || '',
      subject: activeStep?.subject || '',
      body: activeStep?.body || '',
    };
    createTemplate(user?.tenant_id, info);
  };

  const handleStepDelete = (stepId) => {
    let updatedStep = [];
    if (stepId === 1 && allStep.length === 1) {
      updatedStep = [
        {
          s_id: 1,
          _id: null,
          subject: '',
          body: '',
          waitFor: '',
          actives: true,
        },
      ];
    } else {
      const updatedSteps = allStep?.filter((item) => item.s_id !== stepId);

      updatedStep = updatedSteps.map((step, index) => ({
        ...step,
        s_id: index + 1,
        actives: index + 2 === stepId && stepId === allStep.length ? true : index + 1 === stepId,
      }));
    }
    setStep(updatedStep);
  };

  const boxClicked = (id) => {
    const updatedSteps = allStep.map((step, index) => ({
      ...step,
      actives: index === id - 1,
    }));
    setStep(updatedSteps);
  };

  const handleChangeWait = (e) => {
    if (e < 1) {
      sendNotification({
        open: true,
        message: 'Wait time must be greater than 0',
        alert: 'error',
      });
      return;
    }

    const updatedSteps = allStep.map((step) => ({
      ...step,
      waitFor: step.actives ? e : step.waitFor,
    }));

    setStep(updatedSteps);
  };

  const handleChange = (sub) => {
    const updatedSteps = allStep.map((step) => ({
      ...step,
      subject: step.actives ? sub : step.subject,
    }));

    setStep(updatedSteps);
  };

  const handleAddStep = () => {
    setStep((prev) => {
      const _id = prev[prev.length - 1].s_id + 1;
      const newStep = prev.map((step, index) => ({
        ...step,
        waitFor: index + 1 === allStep.length ? 1 : step.waitFor,
        actives: false,
      }));
      return [
        ...newStep,
        {
          s_id: _id,
          _id: null,
          subject: prev[prev.length - 1]?.subject,
          body: '',
          waitFor: 0,
          actives: true,
        },
      ];
    });
  };

  const handleMergeTag = (_value) => {

    const filteredTypeData = typeData[0].type.filter(item => item.name !== 'Custom' && item.name !== 'Do not import');
    
    const _tag = filteredTypeData[_value - 1];

    const updatedSteps = allStep.map((step) => ({
      ...step,
      subject: step.actives ? `${step.subject}{${_tag.value}}` : step.subject,
    }));

    setStep(updatedSteps);
  };



  //  auto save
  const debouncedHandleSave = _debounce((subject, body) => {
    handleAutoSave();
  }, 1000);

  const handleBodyChange = useCallback((name, value) => {
    setStep((prevSteps) => prevSteps.map((_step) => (_step.actives ? { ..._step, [name]: value } : _step)));
    debouncedHandleSave();
  }, [debouncedHandleSave, setStep]);


  useEffect(() => {

      const inputElement = subjectRef?.current?.children[0];

      const handleInputChange = () => {
        debouncedHandleSave();
      };

      inputElement.addEventListener('input', handleInputChange);

      return () => {
        inputElement.removeEventListener('input', handleInputChange);
      };
      
  }, [debouncedHandleSave]);

  const activeStep = useMemo(() => allStep.find((step) => step.actives), [allStep]);

  return (
    <>
      <Box sx={{ padding: 2, mt: 1, height: "100%"}}>
        <Grid container spacing={'2vh'} sx={{ marginX: 'auto', width: '100%' }}>
          {/* left side  */}
          <Grid item xs={4}>
            <Box>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1vh',
                  maxHeight: { xs: '10vh', sm: '40vh', md: '64vh', lg: '66vh', xl: '68vh' },
                  overflowY: 'auto',
                }}
              >
                {allStep?.map((item, index) => (
                  <Box
                    key={index}
                    sx={{
                      padding: '1rem',
                      border: item.actives ? '2px solid #414BD8' : '1px dashed #ccc',
                      background: '#fff',
                    }}
                    onClick={() => boxClicked(item.s_id)}
                  >
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography>Step #{item.s_id}</Typography>
                      <IconButton
                        onClick={(e) => {
                          handleStepDelete(item.s_id);
                          e.stopPropagation();
                        }}
                        sx={{ zIndex: '2' }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                    <Box sx={{ margin: '.5vh' }}>
                      <Typography sx={{ padding: '0.5rem', background: '#F9FAFE' }}>
                        {item.s_id === 1 && (item.subject === '' || !item.subject) ? 'Enter subject' : item.subject}
                      </Typography>
                    </Box>
                    {item.s_id !== allStep.length && (
                      <Grid container sx={{ alignItems: 'center' }}>
                        <Grid item xs={2}>
                          <strong>wait for</strong>
                        </Grid>
                        <Grid item xs={5} sx={{ marginLeft: '9px' }}>
                          <TextField
                            type="number"
                            value={item.waitFor}
                            onChange={(e) => handleChangeWait(e.target.value)}
                          />
                          {/* <TextField value={item.waitFor} onChange={(e) => handleChangeWait(e.target.value, clicked)} /> */}
                        </Grid>
                        <Grid item xs={4}>
                          <strong> &nbsp; days then</strong>
                        </Grid>
                      </Grid>
                    )}
                  </Box>
                ))}
              </Box>

              <Box sx={{ marginTop: '2vh' }}>
                <Button variant="contained" sx={{ width: '100%' }} onClick={handleAddStep}>
                  ADD STEP
                </Button>
              </Box>
            </Box>
          </Grid>

          {/* right side */}
          <Grid
            item
            xs={8}
            sx={{
              right: '2%',
              width: '50%',
              height: '100%',
            }}
          >
            <Box>
              <Button
                variant="outlined"
                color="light"
                onClick={() => setOpenModal(modalType.LeadTemplates)}
                sx={{ height: '6vh' }}
              >
                <img src="/assets/icons/navbar/ic_templates.svg" alt="" style={{ marginRight: '0.5em' }} />
                Choose from my templates
              </Button>
            </Box>
            <Box sx={{ marginY: '1vh' }}>
              <Paper
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  width: '100%',
                  height: '8vh',
                  border: '1px solid #B9BEC7',
                }}
              >
                <div style={{ padding: '0 1vh' }}>Subject</div>
                <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
                <InputBase
                  ref={subjectRef}
                  sx={{ padding: '0 1vh', flex: 1 }}
                  value={activeStep?.subject || ''}
                  placeholder={
                   activeStep?.subject
                      ? ''
                      : "Leave empty to use the previous step's subject."
                  }                  
                  onChange={(e) => handleChange(e.target.value)}
                />
                <Select
                  value={0}
                  sx={{ background: theme.palette.success.light, mr: 2, alignItems: 'center' }}
                  onChange={(e) => handleMergeTag(e.target.value)}
                >
                  <MenuItem value={0}>Merge Tags</MenuItem>
                  {typeData[0].type.filter(data => data.value !== 'custom' && data.value !== "do_not_import")
                  ?.map((data, index) => (
                    <MenuItem key={index} value={index + 1}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <span style={{ display: 'flex', alignItems: 'center' }}>{data.image}</span>
                        <span>{data?.name || data?.value}</span>
                      </div>
                    </MenuItem>
                  ))}
                </Select>
              </Paper>
            </Box>
            <Box sx={{ height: { xs: '20vh', sm: '38vh', md: '48vh', lg: '49vh', xl: '52vh' } }}>
              <TextEditor datas={typeData} value={activeStep} onChange={handleBodyChange} />
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: '1vh' }}>
              <Button
                variant="outlined"
                color="primary"
                onClick={() => {
                  setOpenModal(modalType.EmailPreview);
                  if (allStep[0]?.actives === true) {
                    const step = allStep[0];
                    onNewCampaignInputChange((prev) => ({ ...prev, subject: step.subject, email_body: step.body }));
                  }
                }}
              >
                SEND TEST EMAIL TO ME
              </Button>
              <div>
                <Button
                  variant="text"
                  color="primary"
                  sx={{ marginRight: 1 }}
                  onClick={() => {
                    setOpenModal(modalType.ComfirmSequenceTemplate);
                  }}
                >
                  SAVE AS TEMPLATE
                </Button>

                {updateLocationPath === 'edit' ?   
                  <Button variant="contained" color="primary" onClick={(e) => handleUpdateSave(e)} id="flow-save">
                    Update
                  </Button>
                :
                  <Button variant="contained" color="primary" onClick={(e) => handleSave(e)} id="flow-save">
                    SAVE
                  </Button>
                 }
              </div>
            </Box>
          </Grid>
        </Grid>
      </Box>

      <EmailTemplates
        isOpen={openModal === modalType.LeadTemplates}
        setOpenModal={setOpenModal}
        onSubmit={() => {}}
        onClose={() => setOpenModal(modalType.close)}
        allStep={allStep}
        setStep={setStep}
      />
      <EmailPreview
        isOpen={openModal === modalType.EmailPreview}
        setOpenModal={setOpenModal}
        onSubmit={() => {}}
        onClose={() => setOpenModal(modalType.close)}
        onChange={handleChange}
        allStep={allStep}
      />
      <ConfirmSaveTemplate
        isOpen={openModal === modalType.ComfirmSequenceTemplate}
        setOpenModal={setOpenModal}
        onSubmit={handleTemplateName}
        onClose={() => setOpenModal(modalType.close)}
        message={message}
      />
    </>
  );
};

export default Flow;
