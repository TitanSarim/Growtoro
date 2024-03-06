// import { useNavigate } from 'react-router-dom';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { styled } from '@mui/material/styles';
import { AiFillCheckCircle } from 'react-icons/ai';
import { Checkbox } from '@mui/material';

// const label = { inputProps: { 'aria-label': 'Switch demo' } };

const StyledTableCell = styled(TableCell)(() => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: '#FFFFFF',
    color: '#333333',
  },
  [`&.${tableCellClasses.body}`]: {
    backgroundColor: '#FFFFFF',
    color: '#333333',
  },
}));

const CellContainer = styled('div')((props) => ({
  display: 'flex',
  flexDirection: props?.Direction || 'row',
  justifyContent: props?.Direction ? 'center' : 'start',
  alignItems: props?.Direction ? 'start' : 'center',
}));
const CustomCell = styled('p')((props) => ({
  fontFamily: 'Inter',
  fontStyle: 'normal',
  fontWeight: props?.FontWeight || '400',
  fontSize: props?.FontSize || '16px',
  display: 'flex',
  alignItems: 'center',
  margin: 0,
}));

export default function CampaignDataTable({ rows }) {
  // const navigate = useNavigate();

  return (
    <TableContainer
      component={Paper}
      sx={{
        background: '#FFFFFF',
        boxShadow: '0px 8px 24px rgba(189, 206, 212, 0.2)',
        borderRadius: '10px',
        mt: 2,
      }}
    >
      <Table sx={{ minWidth: 700 }} aria-label="customized table">
        <TableHead>
          <TableRow>
            <StyledTableCell>Email</StyledTableCell>
            <StyledTableCell align="center">Opens</StyledTableCell>
            <StyledTableCell align="center">Clicks </StyledTableCell>
            <StyledTableCell align="center">Replied</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows?.map((row, index) => (
            <TableRow key={index}>
              <StyledTableCell>
                <CellContainer>
                  <Checkbox disableRipple />
                  <CellContainer Direction="column">
                    <CustomCell FontWeight="700">{row?.email}</CustomCell>
                    <CustomCell>
                      <AiFillCheckCircle style={{ color: '#00B783', marginRight: '8px' }} /> Contacted
                    </CustomCell>
                  </CellContainer>
                </CellContainer>
              </StyledTableCell>
              <StyledTableCell align="center">100</StyledTableCell>
              <StyledTableCell align="center">234</StyledTableCell>
              <StyledTableCell align="center">Y/N</StyledTableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
