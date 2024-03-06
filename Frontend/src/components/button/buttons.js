import AddIcon from '@mui/icons-material/Add';
import React from 'react';
import { StyledButton } from './buttonStyles';

export const AddButton = (props) => (
  <StyledButton startIcon={<AddIcon />} {...props}>
   {props.text || 'Add New'}
  </StyledButton>
);
