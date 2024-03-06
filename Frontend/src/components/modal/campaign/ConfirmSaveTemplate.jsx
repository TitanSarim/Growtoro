import { Box, Button, Modal, Stack, TextField, Typography } from '@mui/material';
import { useTemplate } from 'context/TemplateContext';
import { useState } from 'react';
import { StyledButton } from '../../button/buttonStyles';
import { styleBox } from './NewCampaignNameModal';

const ConfirmSaveTemplate = ({ isOpen, setOpenModal, onSubmit, onClose }) => {
  const { isTemplateLoading } = useTemplate();
  const [name, setName] = useState('');
  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={styleBox}>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 1, pt: 3 }}>
          <img src="/assets/icons/navbar/ic_templates.svg" alt="" height={40} width={40} />
          <Typography variant="h3">Create a new template</Typography>
        </Box>
        <Box sx={{ p: '10px 32px' }}>
          <Typography variant="h5" sx={{ mt: 5, mb: 2 }}>
            Name of template
          </Typography>
          <TextField
            type={'text'}
            name={'templateName'}
            placeholder="Template Name"
            variant="outlined"
            value={name}
            onChange={(e) => setName(e.target.value)}
            InputProps={{
              style: {
                height: '95px',
                fontSize: '34px',
              },
            }}
            style={{ width: '100%' }}
          />

          <Stack direction="row" justifyContent="end" alignItems="center" spacing={2} mt={4}>
            <Button onClick={onClose} variant="text" sx={{ fontSize: '1.5em' }}>
              Cancel
            </Button>
            <StyledButton
              onClick={() => {
                onSubmit(name);
                setOpenModal('');
              }}
              padding="15px 50px"
              disabled={isTemplateLoading.createTemplate}
            >
              <Typography variant="h5">{isTemplateLoading.createTemplate ? 'Loading...' : 'ok'}</Typography>
            </StyledButton>
          </Stack>
        </Box>
      </Box>
    </Modal>
  );
};

export default ConfirmSaveTemplate;
