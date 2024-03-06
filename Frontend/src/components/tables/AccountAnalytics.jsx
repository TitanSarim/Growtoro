import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { styled } from '@mui/material/styles';
// import PlayArrowIcon from '@mui/icons-material/PlayArrow';
// import PauseIcon from '@mui/icons-material/Pause';
import { useCampaign } from 'context/CampaignContext';

const StyledTableCell = styled(TableCell)(() => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: '#FFFFFF',
    color: '#333333',
    fontSize: '2.3vh',
    fontWeight: '600',
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

export default function AccountAnalytics() {
  const { analyticsData } = useCampaign();

  return (
    <TableContainer
      component={Paper}
      sx={{
        background: '#FFFFFF',
        boxShadow: '0px 8px 24px rgba(189, 206, 212, 0.2)',
        borderRadius: '10px',
        border: '1px solid rgba(189, 206, 212, 0.4)',
        mt: 2,
      }}
    >
      <Table sx={{ minWidth: 700 }} aria-label="customized table">
        <TableHead>
          <TableRow>
            <StyledTableCell>Account</StyledTableCell>
            <StyledTableCell align="center">Contacted</StyledTableCell>
            <StyledTableCell align="center">Opened</StyledTableCell>
            <StyledTableCell align="center">Replied</StyledTableCell>
            {/* <StyledTableCell align="center">Combined score</StyledTableCell> */}
          </TableRow>
        </TableHead>
        <TableBody>
          {analyticsData?.email_account?.map((row, index) => (
            <TableRow key={index}>
              <StyledTableCell component="th" scope="row">
                <CustomCell FontWeight="700">{row?.smtp_from_name}</CustomCell>
              </StyledTableCell>
              <StyledTableCell align="center">{row?.email_sent_count || 0}</StyledTableCell>
              <StyledTableCell align="center">{row?.open_count || 0} </StyledTableCell>
              <StyledTableCell align="center">{row?.threads_count || 0}</StyledTableCell>
              {/* <StyledTableCell align="center">{row?.combined_score}</StyledTableCell> */}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
