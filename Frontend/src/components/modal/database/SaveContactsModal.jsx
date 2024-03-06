import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { Divider, Accordion, AccordionSummary, Autocomplete, TextField } from '@mui/material';
import CancelIcon from '@mui/icons-material/Cancel';
import { Stack } from '@mui/system';
import AccordionDetails from '@mui/material/AccordionDetails';
// import ControlPointIcon from '@mui/icons-material/ControlPoint';
// import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import { RiPlayListAddLine } from 'react-icons/ri';
import { AiOutlineSend } from 'react-icons/ai';
// import SendIcon from '@mui/icons-material/Send';
import RemoveIcon from '@mui/icons-material/Remove';
import AddIcon from '@mui/icons-material/Add';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '30%',
  bgcolor: 'background.paper',
  boxShadow: 24,
  borderRadius: '10px',
  textAlign: 'center',
  // p: 4,
};

const top100Films = [
  { label: 'The Shawshank Redemption', year: 1994 },
  { label: 'The Godfather', year: 1972 },
  { label: 'The Godfather: Part II', year: 1974 },
  { label: 'The Dark Knight', year: 2008 },
];

const SaveContactsModal = ({ data }) => {
  const [expanded, setExpanded] = React.useState(false);
  const [expandSequence, setExpandeSequence] = React.useState(false);

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };
  const handleChangeSequence = (panel) => (event, isExpanded) => {
    setExpandeSequence(isExpanded ? panel : false);
  };

  return (
    <Modal
      open={data.open}
      onClose={data.handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box>
        <Box sx={style}>
          {/* Top Part */}
          <Stack direction="row" justifyContent="space-between" p={2}>
            <Typography id="modal-modal-title" variant="h6" component="h2" sx={{ ml: 2 }}>
              Save Contacts
            </Typography>
            <CancelIcon style={{ cursor: 'pointer' }} onClick={() => data.handleClose()} />
          </Stack>
          <Divider />

          <Box px={4}>
            <Accordion expanded={expanded === 'panel1'} onChange={handleChange('panel1')}>
              <AccordionSummary
                expandIcon={expanded ? <RemoveIcon sx={{ color: '#7B68EE' }} /> : <AddIcon sx={{ color: '#7B68EE' }} />}
                aria-controls="panel1bh-content"
                id="panel1bh-header"
                sx={{ px: 0 }}
              >
                <Typography
                  sx={{
                    flexShrink: 0,
                    color: '#7B68EE',
                    fontWeight: 'bold',
                    fontSize: '16px',
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  <RiPlayListAddLine color="#7B68EE" size={20} style={{ marginRight: '15px' }} />
                  Add To List
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography>
                  Nulla facilisi. Phasellus sollicitudin nulla et quam mattis feugiat. Aliquam eget maximus est, id
                  dignissim quam.
                </Typography>
              </AccordionDetails>
            </Accordion>
            <Divider />

            <Box textAlign={'left'} my={4}>
              <Typography sx={{ mb: 2 }}>Add To Lists</Typography>
              <Autocomplete
                disablePortal
                id="combo-box-demo"
                options={top100Films}
                sx={{ width: 'full' }}
                renderInput={(params) => <TextField {...params} size="small" placeholder="Enter or create lists..." />}
              />
            </Box>
            <Accordion expanded={expandSequence === 'panel2'} onChange={handleChangeSequence('panel2')}>
              <AccordionSummary
                expandIcon={
                  expandSequence ? <RemoveIcon sx={{ color: '#7B68EE' }} /> : <AddIcon sx={{ color: '#7B68EE' }} />
                }
                aria-controls="panel1bh-content"
                id="panel1bh-header"
                sx={{ px: 0 }}
              >
                <Typography
                  sx={{
                    flexShrink: 0,
                    color: '#7B68EE',
                    fontWeight: '500',
                    fontSize: '16px',
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  <AiOutlineSend color="#7B68EE" fontWeight={600} size={20} style={{ marginRight: '15px' }} />
                  Add To Sequences
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography>
                  Nulla facilisi. Phasellus sollicitudin nulla et quam mattis feugiat. Aliquam eget maximus est, id
                  dignissim quam.
                </Typography>
              </AccordionDetails>
            </Accordion>
          </Box>
        </Box>
      </Box>
    </Modal>
  );
};

export default SaveContactsModal;
