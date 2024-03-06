// import { useNavigate } from 'react-router-dom';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

import { styled } from '@mui/material/styles';
import { Checkbox } from '@mui/material';

const StyledTableCell = styled(TableCell)(() => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: '#FFFFFF',
    color: '#333333',
    fontSize: '0.8rem',
    fontWeight: '400',
  },
  [`&.${tableCellClasses.body}`]: {
    backgroundColor: '#FFFFFF',
    color: '#333333',
  },
}));

const CustomCell = styled('p')((props) => ({
  fontFamily: 'Inter',
  fontStyle: 'normal',
  fontWeight: props?.FontWeight || '400',
  fontSize: props?.FontSize || '16px',
  margin: 0,
}));

export default function DatabaseTable({ rows }) {
  // const navigate = useNavigate();

  return (
    <TableContainer
      component={Paper}
      sx={{
        background: '#FFFFFF',
        boxShadow: '0px 8px 24px rgba(189, 206, 212, 0.2)',
        borderRadius: '10px',
        height: '82vh',
      }}
    >
      <Table aria-label="customized table" sx={{ minWidth: 'max-content' }}>
        <TableHead sx={{ position: 'sticky', top: 0, boxShadow: 5 }}>
          <TableRow>
            <StyledTableCell align="center">Name</StyledTableCell>
            <StyledTableCell align="center">Titles</StyledTableCell>
            <StyledTableCell align="center">Company</StyledTableCell>
            <StyledTableCell align="center">Email</StyledTableCell>
            <StyledTableCell align="center">Contact Location</StyledTableCell>
            <StyledTableCell align="center">Phone</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows?.map((row, index) => (
            <TableRow key={index}>
              <StyledTableCell component="th" scope="row">
                <CustomCell FontWeight="700">
                  <Checkbox disableRipple />
                  Andrew Johnson
                </CustomCell>
              </StyledTableCell>
              <StyledTableCell align="center">HR Operations Manager</StyledTableCell>
              <StyledTableCell align="center">Uniqlo</StyledTableCell>
              <StyledTableCell align="center">
                <span style={{ color: '#7B68EE', textDecoration: 'underline' }}>{row?.email}</span>
              </StyledTableCell>
              <StyledTableCell align="center">London, United Kingdom</StyledTableCell>
              <StyledTableCell align="center">(516) 234-3456</StyledTableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
