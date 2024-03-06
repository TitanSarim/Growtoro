import Table from '@mui/material/Table';
import { Checkbox } from '@mui/material';
import Paper from '@mui/material/Paper';
import TableRow from '@mui/material/TableRow';
import TableBody from '@mui/material/TableBody';
import TableHead from '@mui/material/TableHead';
import TableContainer from '@mui/material/TableContainer';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import { styled } from '@mui/material/styles';
// import { AiFillCheckCircle } from 'react-icons/ai';

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

export default function EmailLeadsTable({rows, selectedRows, setSelectedRows, subscribersFromParseCsv, newCampaign }) {

  console.log("rows", rows)
  const handleCheckboxChange = (event, index) => {
    const selectedId = rows[index].id;
  
    if (event.target.checked) {
      setSelectedRows(prevSelectedIds => {
        if (!prevSelectedIds.includes(selectedId)) {
          return [...prevSelectedIds, selectedId]; 
        }
        return prevSelectedIds; 
      });
    } else {
      setSelectedRows(prevSelectedIds => prevSelectedIds.filter(id => id !== selectedId)); 
    }
  };

  console.log("rows", rows)

  // const handleCheckboxChange = (event, row) => {
  //   if (event.target.checked) {
  //     setSelectedRows([...selectedRows, row.id]);
  //     console.log("selectedRows", selectedRows)
  //   } else {
  //     setSelectedRows(selectedRows.filter((id) => id !== row.id));
  //   }
  // };

  // console.log("selectedRows", rows);

  return (
    <TableContainer
      component={Paper}
      sx={{
        background: '#FFFFFF',
        boxShadow: '0px 8px 24px rgba(189, 206, 212, 0.2)',
        borderRadius: '10px',
        mt: 2,
        height: '73vh',
      }}
    >
      <Table sx={{ minWidth: 700 }} style={{"marginBottom": "5.625rem"}} aria-label="customized table">
        <TableHead>
          <TableRow>
            <StyledTableCell>Mailbox</StyledTableCell>
            <StyledTableCell align="center">Contacted</StyledTableCell>
            <StyledTableCell align="center">Opens</StyledTableCell>
            <StyledTableCell align="center">Clicks </StyledTableCell>
            <StyledTableCell align="center">Replied</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows &&
            rows
            .filter(row => row.email !== null && row.email !== "")
            .map((row, index) => (
              <TableRow key={index}>
                <StyledTableCell>
                  <CellContainer>
                    <Checkbox
                      disableRipple
                      checked={selectedRows.includes(rows[index]?.id)}
                      onChange={(event) => handleCheckboxChange(event, index)}
                    />
                    <CellContainer Direction="column">
                      <CustomCell FontWeight="700">
                        {/* {subscribersFromParseCsv[index]?.email || row?.Email || row?.email} */}
                        {subscribersFromParseCsv[index]?.email ||
                          newCampaign?.email_subscribers[index]?.email ||
                          'not found'}
                      </CustomCell>
                    </CellContainer>
                  </CellContainer>
                </StyledTableCell>

                <StyledTableCell align="center">{row?.contacted || 0}</StyledTableCell>
                <StyledTableCell align="center">{row?.opens || 0}</StyledTableCell>
                <StyledTableCell align="center">{row?.clicks || 0}</StyledTableCell>
                <StyledTableCell align="center">{row?.replies || 0}</StyledTableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
