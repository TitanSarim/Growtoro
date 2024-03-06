import { useEffect, useRef, useState } from 'react';
import { Box, Button, Grid, Modal, Stack, Typography } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import CopyToClipboard from 'react-copy-to-clipboard';

import SearchInput from 'components/input/SearchInput';
import { useUser } from 'context/UserContext';
import { useTemplate } from 'context/TemplateContext';
import { modalType } from '_mock/defines';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  maxWidth: '80%',
  maxHeight: '90%',
  overflow: 'hidden',
  width: '100%',
  bgcolor: 'background.paper',
  boxShadow: 24,
  borderRadius: 2,
  p: '2.5vh 0vw',
};

// const EmailTemplates = ({ isOpen, setOpenModal, onClose, value, setValue, sub, setSub }) => {
const EmailTemplates = ({ isOpen, setOpenModal, onClose, allStep, setStep }) => {
  const boxRef = useRef(null);
  const { user } = useUser();
  const { getAllTemplates, templates, isTemplateLoading, rowCount, getMoreTemplates } = useTemplate();

  const [text, setText] = useState('');
  const [email, setEmail] = useState();
  const [subject, setSubject] = useState('');
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
    q: '',
  });

  const [searchInput, setSearchInput] = useState('');
  const [filteredTemplates, setFilteredTemplates] = useState([]);

  useEffect(() => {
    if (searchInput === '') {
      setFilteredTemplates(templates);
    } else {
      const filtered = templates.filter(
        (template) =>
          template.content.toLowerCase().includes(searchInput.toLowerCase()) ||
          template.subject.toLowerCase().includes(searchInput.toLowerCase())
      );
      setFilteredTemplates(filtered);
    }
  }, [searchInput, templates]);

  // console.log(filteredTemplates);

  useEffect(() => {
    const activeStep = allStep.find((step) => step.actives);
    setText(activeStep?.body ?? '');
    setSubject(activeStep?.subject ?? '');
    getAllTemplates(user?.tenant_id, paginationModel);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getAllTemplates, user?.tenant_id]);

  const submit = () => {
    onClose();
    const updatedSteps = allStep.map((step) => ({
      ...step,
      body: step.actives ? text : step.body,
      subject: step.actives ? subject : step.subject,
    }));
    setStep(updatedSteps);
  };

  const handleCopy = () => {
    const divEl = document.createElement('div');
    divEl.innerHTML = text;

    const tagEls = divEl.querySelectorAll('*');
    let copiedText = '';
    let copiedHtml = '';

    tagEls.forEach((tagEl) => {
      switch (tagEl.tagName) {
        case 'P':
          copiedText += `${tagEl.textContent}\n`;
          break;
        case 'BR':
          copiedText += '\n';
          break;
        case 'DIV':
          copiedText += '\n';
          break;
        case 'IMG': {
          copiedHtml += `<img src="${tagEl.src}" alt="${tagEl.alt}" />`;
          break;
        }
        default:
          copiedText += `${tagEl.textContent}`;
      }
    });

    // Combine the text and image HTML to create the final clipboard content
    // const clipboardContent = copiedHtml;
    const clipboardContent = copiedText + copiedHtml;
    return clipboardContent;
  };

  const loadMore = () => {
    setPaginationModel((prev) => ({ ...prev, page: paginationModel.page + 10 }));
    getMoreTemplates(user?.tenant_id, { page: paginationModel.page + 1, pageSize: paginationModel.pageSize });
  };

  return (
    <Modal open={isOpen} onClose={onClose}>
      <Box sx={style}>
        <Grid container spacing={2} sx={{ marginX: 'auto', width: '100%', p: 2 }}>
          {/* left */}
          <Grid item xs={3} sx={{ borderRight: '1px solid rgba(185, 190, 199, 0.6)' }}>
            <Stack direction="column">
              {/* title  */}
              <Stack direction="row" alignItems="center">
                <img
                  src="/assets/icons/navbar/ic_templates.svg"
                  alt=""
                  style={{ marginRight: '0.5rem', height: '34px', width: '34px' }}
                />
                <Typography variant="h4">Templates</Typography>
              </Stack>

              {/* filter search  */}
              <SearchInput
                placeholder="Filter"
                value={searchInput}
                onChange={(e) => {
                  console.log(e);
                  setSearchInput(e);
                  // setPaginationModel((prev) => ({ ...prev, q: e }));
                  // getAllTemplates(user?.tenant_id, { ...paginationModel, q: e });
                }}
              />

              <Box height="70vh" overflow="auto">
                {filteredTemplates?.map((data, index) => (
                  <Stack
                    key={index}
                    direction="column"
                    alignItems="start"
                    justifyContent="center"
                    sx={{
                      pr: 2,
                      pb: 0.9,
                    }}
                  >
                    <Typography
                      className={`template-name-${index}`}
                      key={index}
                      sx={{
                        width: '100%',
                        px: 1,
                        py: 0.5,
                        fontSize: '14px',
                        background: data.id === email && '#B7A9FE',
                        color: data.id === email && '#ffff',
                        borderRadius: '10px',
                      }}
                      onClick={() => {
                        setEmail(data?.id);
                        setText(data?.content);
                        setSubject(data?.subject);
                      }}
                    >
                      {data?.name || data?.subject}
                    </Typography>
                  </Stack>
                ))}
              </Box>
            </Stack>
            <Box sx={{ textAlign: 'center', mt: 2 }}>
              <LoadingButton
                disabled={templates && templates.length === rowCount}
                loading={isTemplateLoading.loadMore}
                variant="contained"
                onClick={loadMore}
              >
                Show More
              </LoadingButton>
            </Box>
          </Grid>

          {/* right */}
          <Grid item xs={8}>
            <Box sx={{ width: '100%', padding: '1rem' }}>
              <Typography variant="h6" mt={3} mb={2}>
                Subject: {subject}
              </Typography>
              <Box
                ref={boxRef}
                sx={{
                  height: { xs: '20vh', sm: '30vh', md: '40vh', lg: '50vh', xl: '52vh' },
                  mb: 3,
                  background: '#F9FAFE',
                  p: 1,
                  overflow: 'auto',
                  borderRadius: 1,
                }}
                className="simple-email-editor"
                dangerouslySetInnerHTML={{ __html: text }}
              />
              <Box>
                <CopyToClipboard text={handleCopy()} onCopy={() => {}}>
                  <Button
                    variant="outlined"
                    onClick={() => setOpenModal(modalType.LeadTemplates)}
                    sx={{ fontSize: '1.2em' }}
                  >
                    <img src="/assets/icons/copy.svg" alt="" style={{ marginRight: '0.5rem' }} /> copy
                  </Button>
                </CopyToClipboard>

                <Button variant="contained" onClick={submit} sx={{ ml: 1, fontSize: '1.2em' }}>
                  Use template
                </Button>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Modal>
  );
};

export default EmailTemplates;
