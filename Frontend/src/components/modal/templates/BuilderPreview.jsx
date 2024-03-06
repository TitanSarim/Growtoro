/* eslint-disable react/self-closing-comp */
import { Divider, IconButton, Typography } from '@mui/material';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import DesktopWindowsOutlinedIcon from '@mui/icons-material/DesktopWindowsOutlined';
import PhoneIphoneOutlinedIcon from '@mui/icons-material/PhoneIphoneOutlined';
import { useState } from 'react';
import CloseIcon from '@mui/icons-material/Close';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '70%',
  bgcolor: 'background.paper',
  boxShadow: 24,
  borderRadius: '10px',
  px: 4,
  py: 2,
};

const circleIconStyle = {
  width: '0.8rem',
  height: '0.8rem',
  borderRadius: '50%',
  border: '1px solid #d1cece',
  backgroundColor: '#f1f1f1',
};

const homeIconStyle = {
  width: '2.5rem',
  height: '2.5rem',
  borderRadius: '50%',
  border: '1px solid #d1cece',
  backgroundColor: '#f1f1f1',
};

const microphoneIconStyle = {
  width: '5rem',
  height: '0.5rem',
  borderRadius: '1rem',
  border: '1px solid #d1cece',
  backgroundColor: '#f1f1f1',
};

const EditTemplateModal = ({ isOpen, onClose, template }) => {
  const [viewMode, setViewMode] = useState('desktop');

  return (
    <Modal open={isOpen} onClose={onClose} disableAutoFocus>
      <Box sx={style}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="h6">{template.name}</Typography>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>
        <Box>
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
            <IconButton onClick={() => setViewMode('desktop')}>
              <DesktopWindowsOutlinedIcon />
            </IconButton>
            <Divider orientation="vertical" flexItem />
            <IconButton onClick={() => setViewMode('mobile')}>
              <PhoneIphoneOutlinedIcon />
            </IconButton>
          </Box>
          {viewMode === 'desktop' ? (
            <Box sx={{ border: '1px solid #d1cece' }}>
              <Box
                sx={{
                  padding: '1rem',
                  display: 'flex',
                  gap: '0.5rem',
                  borderBottom: '1px solid #d1cece',
                }}
              >
                <div style={circleIconStyle}></div>
                <div style={circleIconStyle}></div>
                <div style={circleIconStyle}></div>
              </Box>
              <Box sx={{ overflow: 'hidden', height: '70vh' }}>
                <iframe
                  title={template.name}
                  srcDoc={template.body}
                  style={{ border: 'none', width: '100%', height: '100%' }}
                />
              </Box>
            </Box>
          ) : (
            <Box
              sx={{
                border: '1px solid #d1cece',
                width: '345px',
                margin: 'auto',
                borderRadius: '2rem',
              }}
            >
              <Box
                sx={{
                  padding: '1rem',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  gap: '0.5rem',
                }}
              >
                <div style={circleIconStyle}></div>
                <div style={microphoneIconStyle}></div>
              </Box>
              <Box sx={{ overflow: 'hidden', height: '62.5vh', marginX: '0.5rem', borderTop: '1px solid #d1cece' }}>
                <iframe
                  title={template.name}
                  srcDoc={template.body}
                  style={{ border: 'none', width: '100%', height: '100%' }}
                />
              </Box>
              <Box
                sx={{
                  padding: '1rem',
                  display: 'flex',
                  justifyContent: 'center',
                  borderTop: '1px solid #d1cece',
                }}
              >
                <div style={homeIconStyle}></div>
              </Box>
            </Box>
          )}
        </Box>
      </Box>
    </Modal>
  );
};

export default EditTemplateModal;
