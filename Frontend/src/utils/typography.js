import { Typography } from '@mui/material';
import styled from 'styled-components';

export const HeaderTitle = styled(Typography)`
  font-family: 'Inter';
  font-style: normal;
  font-weight: 700;
  font-size: 28px;
  line-height: 40px;
  color: #333333;
  padding-bottom: 1rem;
`;
export const SubHeaderTitle = styled(Typography)`
  font-family: 'Inter';
  font-style: normal;
  font-weight: 600;
  font-size: 18px;
  line-height: 22px;
`;
export const PlainText = styled(Typography)`
  font-family: 'Inter';
  font-style: normal;
  font-weight: ${(props) => props.fontWeight || '400'};
  font-size: ${(props) => props.fontSize || '20px'};
  line-height: 24px;
  text-align: ${(props) => props.textAlign || 'center'};
  color: ${(props) => props.color || '#000000'};
  width: ${(props) => props.width && '100%'};
  max-width: ${(props) => props.width};
  margin: ${(props) => props.margin};
  padding: ${(props) => props.padding};
  border-radius: ${(props) => props.borderRadius};
  background-color: ${(props) => props.backgroundColor};
`;
