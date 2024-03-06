import { Button } from '@mui/material';
import styled from 'styled-components';

export const StyledButton = styled(Button)`
  font-family: 'Inter';
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 19px;
  padding: ${(props) => props.padding || '8px 13px'};
  text-align: center;
  text-transform: uppercase;
  background: #7b68ee;
  color: #ffffff;
  &:hover {
    background: #7b68ee;
  }
`;
