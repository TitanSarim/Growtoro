import { useCallback, useState } from 'react';
import CancelIcon from '@mui/icons-material/Cancel';
// import EditIcon from '@mui/icons-material/Edit';
// import SaveIcon from '@mui/icons-material/Save';
import {
  Button,
  Divider,
  Grid,
  // IconButton,
  InputBase,
  MenuItem,
  Paper,
  Select,
  TextField,
  useTheme,
} from '@mui/material';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Typography from '@mui/material/Typography';
import Autocomplete from '@mui/material/Autocomplete';
import { Stack } from '@mui/system';
import { tagOptions } from '_mock/defines';

import DynamicDropdown from 'components/input/DynamicDropdown';
import { useCampaign } from 'context/CampaignContext';
import { useEmail } from 'context/EmailContext';
import { useUser } from 'context/UserContext';
import { useTemplate } from 'context/TemplateContext';
// import EditEmail from 'pages/Templates/All/EditEmail';
import TextEditor from '../campaign/TextEdit/TextEditor';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '80%',
  bgcolor: 'background.paper',
  boxShadow: 24,
  borderRadius: '10px',
  fontSize: '1.4em',
  overflow: 'scroll',
};

const NewTemplateModal = ({ data }) => {
  const theme = useTheme();
  const { user } = useUser();
  const { sendTestEmail, isLoading, typeData } = useCampaign();
  const { emails } = useEmail();
  // eslint-disable-next-line no-unused-vars
  const [isEditing, setIsEditing] = useState(false);
  const { createTemplate, isTemplateLoading } = useTemplate();
  const [editTamplate, setEditTamplate] = useState({
    tags: [],
    subject: '',
    body: '',
  });

  const handleMergeTag = (_value) => {
    const _tag = typeData[0].type[_value - 1];
    if (_tag) setEditTamplate((prev) => ({ ...prev, subject: `${prev.subject}{${_tag.value}}` }));
  };

  const submit = () => {
    const info = {
      tags: editTamplate.tags,
      subject: editTamplate.subject,
      body: editTamplate.body,
    };
    createTemplate(user.tenant_id, info);
    setTimeout(() => {
      data.handleClose();
    }, 1000);
  };

  const handleBodyChange = useCallback((name, value) => {
    setEditTamplate((prev) => ({ ...prev, [name]: value }));
  }, []);

  const onChangeHandler = (e) => {
    const email = emails.filter((_email) => _email.id === e.target.value);
    if (email[0]) {
      setEditTamplate((prev) => ({ ...prev, from: email[0].smtp_from_email }));
    }
  };

  const handleTagsChange = (event, values) => {
    setEditTamplate((prev) => ({ ...prev, tags: values }));
  };

  return (
    <Modal
      open={data.openModal}
      onClose={() => {
        data.handleClose();
        setIsEditing(false);
      }}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box>
        <Box sx={style}>
          <Stack direction="row" justifyContent="space-between" p={2}>
            <Box> </Box>
            <CancelIcon style={{ cursor: 'pointer' }} onClick={() => data.handleClose()} />
          </Stack>
          <Divider />

          <Grid container>
            <Grid item xs={7} p={2} className="dev">
              <>
                <Box sx={{ marginY: 2 }}>
                  <Autocomplete
                    freeSolo
                    multiple
                    id="tags-standard"
                    options={tagOptions}
                    getOptionLabel={(option) => option}
                    onChange={handleTagsChange}
                    renderInput={(params) => (
                      <TextField {...params} variant="outlined" label="Tags" placeholder="Sales" />
                    )}
                  />
                </Box>

                <Box sx={{ marginY: 2 }}>
                  <Paper
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      width: '100%',
                      border: '1px solid #B9BEC7',
                      backgroundColor: '#F9FAFE',
                    }}
                  >
                    <div style={{ padding: '0 1rem' }}>Subject</div>
                    <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
                    <InputBase
                      sx={{ ml: 1, flex: 1 }}
                      placeholder={'Brand Campaign 2023'}
                      value={editTamplate.subject}
                      onChange={(e) => handleBodyChange('subject', e.target.value)}
                    />

                    <Select
                      value={'0'}
                      sx={{ background: theme.palette.success.light, mr: 1, alignItems: 'center', my: 1 }}
                      onChange={(e) => handleMergeTag(e.target.value)}
                    >
                      <MenuItem value={0}>Merge Tags</MenuItem>
                      {typeData[0].type.map((data, index) => (
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
                <Box sx={{ height: { xs: '20vh', sm: '38vh', md: '40vh', lg: '49vh', xl: '51vh' } }}>
                  <TextEditor value={editTamplate} onChange={handleBodyChange} datas={typeData} />
                </Box>
              </>
            </Grid>

            <Grid item xs={5} sx={{ borderLeft: '2px solid rgba(185, 190, 199, 0.2)' }} p={2} className="dev">
              <Typography pb={2} mt={2} variant="body1">
                This is a preview for an example contact. Click here to generate the preview for a specific contact.
              </Typography>
              <Box sx={{ backgroundColor: '#F9FAFE', p: 2, borderRadius: '10px', height: '53vh', overflowY: 'scroll' }}>
                <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', mb: 2 }}>
                  <Typography variant="h5">To:</Typography>
                  <TextField
                    id="template_receiver_email"
                    variant="standard"
                    placeholder="Enter email address"
                    required
                    value={editTamplate.to}
                    onChange={(e) => handleBodyChange('to', e.target.value)}
                    sx={{
                      width: '100%',
                    }}
                  />
                </Box>
                <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6">From:</Typography>
                  <DynamicDropdown
                    name="email"
                    onChangeHandler={onChangeHandler}
                    selectItems={emails?.map((data) => ({ id: data?.id, value: data?.smtp_from_email }))}
                  />
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center' }} mb={2}>
                  <Typography variant="h6" component="span" mr={1}>
                    Tags:{' '}
                  </Typography>
                  <Typography>[ {editTamplate.tags.map((tag) => tag).join(', ')} ]</Typography>
                </Box>

                <Typography variant="h6" component="p" mb={2}>
                  Subject: {editTamplate.subject}
                </Typography>

                <Box className="simple-email-editor" dangerouslySetInnerHTML={{ __html: editTamplate.body }} />
              </Box>

              <Stack direction={'row'} justifyContent="flex-end" my={1}>
                <Button
                  variant="outlined"
                  onClick={() => {
                    sendTestEmail(
                      user?.tenant_id,
                      {
                        to_mail: editTamplate.to,
                        from_mail: editTamplate.from,
                        subject: editTamplate.subject,
                        body: editTamplate.body,
                      },
                      data.setOpenModal
                    );
                  }}
                  disabled={isLoading.sendTestEmail}
                >
                  {isLoading.sendTestEmail ? 'Loading...' : 'SEND TEST EMAIL'}
                </Button>
                <Button sx={{ ml: 1 }} variant="contained" onClick={submit} disabled={isTemplateLoading.createTemplate}>
                  {isTemplateLoading.createTemplate ? 'Loading...' : 'SAVE CHANGES'}
                </Button>
              </Stack>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Modal>
  );
};

export default NewTemplateModal;
