/* eslint-disable react/self-closing-comp */
import CancelIcon from '@mui/icons-material/Cancel';
import LoadingButton from '@mui/lab/LoadingButton';
import { createFilterOptions } from '@mui/material/Autocomplete';
// import EditIcon from '@mui/icons-material/Edit';
// import SaveIcon from '@mui/icons-material/Save';
import {
  Autocomplete,
  Button,
  Divider,
  Grid,
  // IconButton,
  InputBase,
  MenuItem,
  Paper,
  Select,
  Stack,
  TextField,
  useTheme,
} from '@mui/material';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Typography from '@mui/material/Typography';
import DynamicDropdown from 'components/input/DynamicDropdown';

import Api from 'api/Api';
import { useCampaign } from 'context/CampaignContext';
import { useEmail } from 'context/EmailContext';
import { useTemplate } from 'context/TemplateContext';
import { useUser } from 'context/UserContext';
import { useCallback, useEffect, useState } from 'react';
import { tagOptions } from '_mock/defines';
import { useNotification } from 'context/NotificationContext';

import TextEditor from '../campaign/TextEdit/TextEditor';

const filter = createFilterOptions();

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '90%',
  bgcolor: 'background.paper',
  boxShadow: 24,
  borderRadius: '10px',
  fontSize: '1.4em',
  maxHeight: '80vh',
};

const EditTemplateModal = ({ isOpen, onClose, setOpenModal, handleDeleteTemplate }) => {
  const theme = useTheme();
  const { user } = useUser();
  const { singleTem, updateTemplate, isTemplateLoading, editAble } = useTemplate();
  const { sendTestEmail, isLoading, typeData } = useCampaign();
  const { emails } = useEmail();
  const { sendNotification } = useNotification();

  const [editTamplate, setEditTamplate] = useState({});
  // const [isEditing, setIsEditing] = useState(false);

  const [loading, setLoading] = useState({
    delete: false,
  });

  useEffect(() => {
    setEditTamplate({
      id: singleTem.id,
      tags: singleTem.tags,
      subject: singleTem.subject,
      body: singleTem.content,
      can_delete: singleTem.can_delete,
    });
  }, [singleTem]);

  const handleMergeTag = (_value) => {
    const _tag = typeData[0].type[_value - 1];
    if (_tag) setEditTamplate((prev) => ({ ...prev, subject: `${prev.subject}{${_tag.value}}` }));
  };

  const submit = () => {
    const info = {
      id: editAble,
      tags: editTamplate.tags,
      subject: editTamplate.subject,
      body: editTamplate.body,
    };
    updateTemplate(user.tenant_id, info);
    setTimeout(() => {
      onClose();
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

  const handleDelete = () => {
    setLoading((prev) => ({ ...prev, delete: true }));

    Api.template
      .removeTemplate(user?.tenant_id, {
        id: editAble,
      })
      .then(() => {
        sendNotification({
          open: true,
          message: 'Template deleted successfully',
          alert: 'warning',
        });
      })
      .finally(() => {
        setLoading((prev) => ({ ...prev, delete: false }));
        window.location.reload();

        setOpenModal(false);
      });

    // reload the page

    // onClose();
  };

  return (
    <>
      {editTamplate && (
        <Modal
          open={isOpen}
          onClose={() => {
            setEditTamplate((prev) => ({ ...prev, subject: singleTem?.subject }));
            // setIsEditing(false);
            onClose();
          }}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box>
            <Box sx={style}>
              <Stack direction="row" justifyContent="space-between" p={2}>
                <Typography variant="h6" component="h2" style={{ fontWeight: 'bold' }}></Typography>
                <CancelIcon style={{ cursor: 'pointer' }} onClick={onClose} />
              </Stack>
              <Divider />

              <Grid
                container
                sx={{
                  height: 'calc(100vh - 246px)',
                  overflow: 'auto',
                }}
              >
                <Grid item xs={7} p={2}>
                  <Box>
                    <Box sx={{ marginY: 2 }}>
                      {/* // ? this is the current one */}
                      <Autocomplete
                        freeSolo
                        multiple
                        id="tags-standard"
                        options={tagOptions}
                        getOptionLabel={(option) => option}
                        defaultValue={singleTem?.tags || []}
                        onChange={handleTagsChange}
                        renderInput={(params) => (
                          <TextField {...params} variant="outlined" label="Tags" placeholder="Sales" />
                        )}
                      />

                      {/* // ! this is the new one */}
                      {/* <Autocomplete
                        multiple
                        options={tagsValueForAutocomplete}
                        getOptionLabel={(option) => {
                          console.log(option);
                          return option.title;
                        }}
                        defaultValue={editTamplate.tags}
                        onChange={handleTagsChange}
                        renderInput={(params) => (
                          <TextField {...params} variant="outlined" label="Tags" placeholder="Sales" />
                        )}
                        filterOptions={(options, params) => {
                          const filtered = filter(options, params);

                          // Suggest the creation of a new value
                          if (params.inputValue !== '') {
                            filtered.push({
                              value: params.inputValue,
                              title: `Add "${params.inputValue}"`,
                            });
                          }

                          return filtered;
                        }}
                      /> */}
                    </Box>

                    {/* subject  */}
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
                          defaultValue={singleTem?.name}
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
                        {/* </IconButton> */}
                      </Paper>
                    </Box>
                    <Box sx={{ height: { xs: '20vh', sm: '38vh', md: '40vh', lg: '49vh', xl: '51vh' } }}>
                      <TextEditor value={editTamplate} onChange={handleBodyChange} datas={typeData} />
                    </Box>
                  </Box>
                </Grid>

                <Grid item xs={5} sx={{ borderLeft: '2px solid rgba(185, 190, 199, 0.2)' }} p={2}>
                  <Typography pb={2} mt={2} variant="body1">
                    This is a preview for an example contact. Click here to generate the preview for a specific contact.
                  </Typography>
                  <Box
                    sx={{ backgroundColor: '#F9FAFE', p: 2, borderRadius: '10px', height: '53vh', overflowY: 'scroll' }}
                  >
                    <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', mb: 1 }}>
                      <Typography variant="h6">To:</Typography>
                      <TextField
                        id="template_receiver_email"
                        variant="standard"
                        placeholder="@example.com"
                        required
                        value={editTamplate.to}
                        onChange={(e) => handleBodyChange('to', e.target.value)}
                        sx={{
                          width: '100%',
                        }}
                      />
                    </Box>
                    <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', mb: 1 }}>
                      <Typography variant="h6">From:</Typography>
                      <DynamicDropdown
                        name="email"
                        onChangeHandler={onChangeHandler}
                        selectItems={emails?.map((data) => ({ id: data?.id, value: data?.smtp_from_email }))}
                      />
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center' }} mb={2}>
                      <Typography variant="h6" component="span" mr={1}>
                        Tags:
                      </Typography>
                      <Typography>[ {editTamplate?.tags?.map((tag) => tag).join(', ')} ]</Typography>
                    </Box>

                    <Typography component="p" variant="h6" mb={2}>
                      <strong>Subject:</strong> {editTamplate.subject}
                    </Typography>

                    <Box className="simple-email-editor" dangerouslySetInnerHTML={{ __html: editTamplate.body }} />
                  </Box>

                  <Stack direction={'row'} justifyContent="flex-end" my={1}>
                    {editTamplate.can_delete ? (
                      <LoadingButton variant="outlined" color="error" onClick={handleDelete} loading={loading.delete}>
                        Delete
                      </LoadingButton>
                    ) : null}

                    <Button
                      sx={{ ml: 1 }}
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
                          setOpenModal
                        );
                      }}
                      disabled={isLoading.sendTestEmail}
                    >
                      {isLoading.sendTestEmail ? 'Loading...' : 'SEND TEST EMAIL'}
                    </Button>

                    <Button
                      sx={{ ml: 1 }}
                      variant="contained"
                      onClick={submit}
                      disabled={isTemplateLoading.updateTemplate}
                    >
                      {isTemplateLoading.updateTemplate ? 'Loading...' : 'SAVE CHANGES'}
                    </Button>
                  </Stack>
                </Grid>
              </Grid>
            </Box>
          </Box>
        </Modal>
      )}
    </>
  );
};

export default EditTemplateModal;
