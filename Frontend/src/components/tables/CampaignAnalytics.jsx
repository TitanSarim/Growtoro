import PauseIcon from '@mui/icons-material/Pause';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { styled } from '@mui/material/styles';
import { useCampaign } from 'context/CampaignContext';
import { useUser } from 'context/UserContext';

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

export default function CampaignAnalytics() {
  const { analyticsData, updateStatusSwitch } = useCampaign();
  const { user } = useUser();
  const onSwitchChange = (campaignId, status) => {
    const _status = status ? 0 : 1;

    updateStatusSwitch(user?.tenant_id, {
      id: campaignId,
      status: _status,
    });
  };
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
            <StyledTableCell>Campaign</StyledTableCell>
            <StyledTableCell align="center">Status</StyledTableCell>
            <StyledTableCell align="center">Contacted</StyledTableCell>
            <StyledTableCell align="center">Opened</StyledTableCell>
            <StyledTableCell align="center">Replied</StyledTableCell>
            <StyledTableCell align="center" />
          </TableRow>
        </TableHead>
        <TableBody>
          {analyticsData?.campaigns?.map((row, index) => (
            <TableRow key={index}>
              <StyledTableCell component="th" scope="row">
                <CustomCell FontWeight="700">{row?.name}</CustomCell>
              </StyledTableCell>
              <StyledTableCell align="center">
                {row?.status === true ? (
                  <span
                    style={{
                      padding: '5px 10px',
                      // background: 'rgba(254, 62, 65, 0.1)',
                      borderRadius: '2px',
                      color: '#00B783',
                    }}
                  >
                    Active
                  </span>
                ) : (
                  <span
                    style={{
                      padding: '5px 10px',
                      // background: 'rgba(254, 62, 65, 0.1)',
                      borderRadius: '2px',
                      color: '#FE3E41',
                    }}
                  >
                    Paused
                  </span>
                )}
              </StyledTableCell>
              <StyledTableCell align="center">{row?.contacted}</StyledTableCell>
              <StyledTableCell align="center">
                {row?.opened} || {row?.opened_percentage}%
              </StyledTableCell>
              <StyledTableCell align="center">
                {row?.replied} || {row?.replied_percentage}%
              </StyledTableCell>
              <StyledTableCell align="center" onClick={() => onSwitchChange(row.id, row.status)}>
                {/* <PauseIcon sx={{ color: '#B9BEC7', cursor: 'pointer' }} /> */}
                {row?.status === true ? (
                  <PauseIcon sx={{ color: '#FE3E41', cursor: 'pointer' }} />
                ) : (
                  <PlayArrowIcon sx={{ color: '#00B783', cursor: 'pointer' }} />
                )}
              </StyledTableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
