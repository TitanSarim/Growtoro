import React from 'react';
import { Divider, Stack } from '@mui/material';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import { PlainText, SubHeaderTitle } from '../../../utils/typography';

const ModalsHeader = ({ title, subHeader, handleClose }) => (
  <>
    <Stack direction="row" justifyContent="space-between" p="25px 32px">
      <Stack sx={{ display: 'flex', justifyContent: 'center' }}>
        <SubHeaderTitle>{title}</SubHeaderTitle>
        {subHeader && (
          <PlainText fontSize="0.8rem" textAlign={'start'} sx={{ display: 'flex', justifyContent: 'center' }}>
            {subHeader}
          </PlainText>
        )}
      </Stack>
      <HighlightOffIcon onClick={handleClose} sx={{ cursor: 'pointer', height: 42, width: 32 }} />
    </Stack>
    <Divider sx={{ m: 0 }} />
  </>
);

export default ModalsHeader;
