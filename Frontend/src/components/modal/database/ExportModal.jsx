import CancelIcon from '@mui/icons-material/Cancel';
import { Accordion, Button, Divider } from '@mui/material';
import AccordionDetails from '@mui/material/AccordionDetails';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Typography from '@mui/material/Typography';
import { Stack } from '@mui/system';
import { StyledButton } from 'components/button/buttonStyles';
import React, { createRef, useRef } from 'react';
import { CSVLink } from 'react-csv';
import { FiDownload } from 'react-icons/fi';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '50%',
  bgcolor: 'background.paper',
  boxShadow: 24,
  borderRadius: '10px',
  textAlign: 'center',
  // p: 4,
};

const ExportModal = ({ data }) => {
  const [expanded, setExpanded] = React.useState(false);
  // eslint-disable-next-line no-unused-vars
  const [expandSequence, setExpandeSequence] = React.useState(false);

  const itemEls = useRef(data.csvLink.map(() => createRef()));

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  // const handleChangeSequence = (panel) => (event, isExpanded) => {
  //   setExpandeSequence(isExpanded ? panel : false);
  // };

  // const [selectedValue, setSelectedValue] = React.useState('a');

  // const handleRadioChange = (event) => {
  //   setSelectedValue(event.target.value);
  // };

  // const controlProps = (item) => ({
  //   checked: selectedValue === item,
  //   onChange: handleChange,
  //   value: item,
  //   name: 'color-radio-button-demo',
  //   inputProps: { 'aria-label': item },
  // });

  const confirmButtonRef = useRef(null);

  const handleConfirmClick = () => {
    itemEls.current.forEach((el) => {
      el.current.link.click();
    });
    data.handleExportsOpen();
  };

  return (
    <Modal
      open={data.exports}
      onClose={data.handleExportsClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box>
        <Box sx={style}>
          {/* Top Part */}
          <Stack direction="row" justifyContent="space-between" p={2}>
            <Typography id="modal-modal-title" variant="h6" component="h2" sx={{ ml: 2 }}>
              Export
            </Typography>
            <CancelIcon style={{ cursor: 'pointer' }} onClick={() => data.handleExportsClose()} />
          </Stack>
          <Divider />

          <Box px={4}>
            <Accordion expanded={expanded === 'panel1'} onChange={handleChange('panel1')}>
              <Typography
                sx={{
                  flexShrink: 0,
                  color: '#7B68EE',
                  fontWeight: 'bold',
                  fontSize: '18px',
                  display: 'flex',
                  alignItems: 'center',
                  py: 2,
                }}
              >
                <FiDownload color="#7B68EE" size={25} style={{ marginRight: '15px' }} />
                Export As CSV
              </Typography>
              {/* </AccordionSummary> */}
              <AccordionDetails>
                <Typography>
                  Nulla facilisi. Phasellus sollicitudin nulla et quam mattis feugiat. Aliquam eget maximus est, id
                  dignissim quam.
                </Typography>
              </AccordionDetails>
            </Accordion>
            <Divider />

            <Box textAlign={'left'} my={2}>
              <Typography
                sx={{ mb: 2, fontSize: 18, fontFamily: 'inter', color: '#7C828D' }}
                noWrap={false}
                display="block"
              >
                {/* You will be charged 1 marketplace credit for every email. */}
                {data.message}
              </Typography>
              <Typography
                sx={{ mb: 2, fontSize: 18, fontFamily: 'inter', color: '#7C828D' }}
                noWrap={false}
                display="block"
              >
                Your CSV will be immediately downloaded to your desktop.
              </Typography>
              <Divider />
              <Typography variant="h6" color="textSecondary" marginTop={1}>
                Download the CSV
              </Typography>
            </Box>
            <Stack direction="row" justifyContent="end" alignItems="center" spacing={2} my={2}>
              {/* <StyledButton onClick={data.handleExportsOpen}> */}
              <StyledButton ref={confirmButtonRef} onClick={handleConfirmClick}>
                <Typography variant="h6" color="white" className="MuiTypography-underlineNone">
                  Confirm
                </Typography>
              </StyledButton>
              {data.csvLink.map((item, index) => (
                <CSVLink
                  {...item}
                  key={index}
                  id={`download-button-${index}`}
                  className="download-button"
                  ref={itemEls.current[index]}
                  style={{ display: 'none' }}
                >
                  Download
                </CSVLink>
              ))}
              <Button onClick={data.handleExportsClose} variant="outlined" sx={{ fontSize: '1em' }}>
                Cancel
              </Button>
            </Stack>
          </Box>
        </Box>
      </Box>
    </Modal>
  );
};

export default ExportModal;
