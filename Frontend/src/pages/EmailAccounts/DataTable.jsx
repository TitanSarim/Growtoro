import DeleteIcon from '@mui/icons-material/Delete';
import SettingsIcon from '@mui/icons-material/Settings';
import { Divider, FormControlLabel, IconButton, Menu, MenuItem } from '@mui/material';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { styled } from '@mui/material/styles';
import { modalType } from '_mock/defines';
import { IOSSwitch } from 'components/button/CustomSwitch';
import AddModalsForms from 'components/modal/emails/AddModalsForms';
import DeleteEmail from 'components/modal/emails/DeleteEmail';
import { useEmail } from 'context/EmailContext';
// import { useNotification } from 'context/NotificationContext';
import { useUser } from 'context/UserContext';
import { useState } from 'react';
// import { useNavigate } from 'react-router-dom';

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

const CustomCell = styled('p')((props) => ({
  fontFamily: 'Inter',
  fontStyle: 'normal',
  fontWeight: props?.FontWeight || '400',
  fontSize: props?.FontSize || '16px',
  margin: 0,
}));

// const StyledTableRow = styled(TableRow)(({ theme }) => ({}));

export default function DataTable({ rows }) {
  const { user } = useUser();
  const { updateEmailStatus, emails, setEditAble } = useEmail();

  const [openModal, setOpenModal] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);
  const [check, setCheck] = useState(false);

  const updateModal = (id) => {
    setEditAble(id);
  };

  const closeModal = () => {
    setOpenModal(modalType.Close);
    setEditAble();
  };

  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSwitchChange = (rowID, e) => {
    const _status = e ? 1 : 0;
    updateEmailStatus(user?.tenant_id, { id: rowID, type: 'status', value: _status });
    setCheck(!check);
  };

  const onSwitchClick = (rowID, e) => {
    const _warm = e ? 0 : 1;
    updateEmailStatus(user?.tenant_id, { id: rowID, type: 'warm_up', value: _warm });
  };

  return (
    <>
      {emails && (
        <TableContainer
          component={Paper}
          sx={{
            background: '#FFFFFF',
            boxShadow: '0px 8px 24px rgba(189, 206, 212, 0.2)',
            borderRadius: '10px',
            height: '73vh',
            overflow: 'auto',
          }}
        >
          <Table sx={{ minWidth: 700 }} stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                <StyledTableCell>Email</StyledTableCell>
                {/* <StyledTableCell align="center">Daily Limit</StyledTableCell> */}
                <StyledTableCell align="center">Sent Today</StyledTableCell>
                <StyledTableCell align="center">Replies Received</StyledTableCell>
                <StyledTableCell align="center">Smart Warmup</StyledTableCell>
                <StyledTableCell align="center">Sender Name</StyledTableCell>
                <StyledTableCell align="center">Settings</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows?.map((row, index) => (
                <TableRow key={index} onClick={() => updateModal(row.id)}>
                  <StyledTableCell component="th" scope="row">
                    <CustomCell FontWeight="700">
                      <IconButton
                        size="small"
                        onClick={(event) => event.stopPropagation()}
                        disableRipple
                        style={{ backgroundColor: 'transparent', boxShadow: 'none' }}
                      >
                        <FormControlLabel
                          control={<IOSSwitch checked={row.status === 1} sx={{ m: 1 }} />}
                          onClick={(e) => handleSwitchChange(row.id, e.target.checked)}
                          sx={{ mx: '0 !important' }}
                        />
                      </IconButton>
                      {row?.smtp_from_email}
                    </CustomCell>
                  </StyledTableCell>
                  <StyledTableCell align="center">{row.today_email_sent_count}</StyledTableCell>
                  <StyledTableCell align="center">{row.threads_count}</StyledTableCell>
                  <StyledTableCell align="center">
                    {/* <IconButtonFunction id={row.id} onSwitchClick={onSwitchClick} warmUp={row.warm_up === 1} /> */}
                    <IconButton
                      size="small"
                      onClick={() => onSwitchClick(row.id, row.warm_up === 1)}
                      disableRipple
                      style={{ backgroundColor: 'transparent', boxShadow: 'none' }}
                    >
                      {row.warm_up === 1 ? (
                        <img
                          src="/assets/images/warm.png"
                          height="24px"
                          width="24px"
                          alt="warm"
                          style={{ margin: 'auto' }}
                        />
                      ) : (
                        <img
                          src="/assets/images/warm2.png"
                          height="24px"
                          width="24px"
                          alt="warm"
                          style={{ margin: 'auto' }}
                        />
                      )}
                    </IconButton>
                  </StyledTableCell>
                  <StyledTableCell align="center">{row?.smtp_from_name}</StyledTableCell>
                  <StyledTableCell align="center">
                    <IconButton
                      onClick={handleClick}
                      aria-controls={open ? 'basic-menu' : undefined}
                      aria-haspopup="true"
                      aria-expanded={open ? 'true' : undefined}
                    >
                      <SettingsIcon alt="photoURL" />
                    </IconButton>
                  </StyledTableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <Menu
            id="basic-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            MenuListProps={{
              'aria-labelledby': 'basic-button',
            }}
          >
            <MenuItem
              onClick={() => {
                handleClose();
                setOpenModal(modalType.ConnectSMTP);
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <SettingsIcon />
                <div>&nbsp;Settings</div>
              </div>
            </MenuItem>

            <Divider variant="middle" />

            <MenuItem
              onClick={() => {
                handleClose();
                setOpenModal(modalType.DeleteEmail);
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <DeleteIcon />
                <div>{'\u00a0'}Remove Account</div>
              </div>
            </MenuItem>
          </Menu>
          <AddModalsForms
            isOpen={openModal === modalType.ConnectSMTP}
            onClose={closeModal}
            onBack={() => setOpenModal(modalType.SelectType)}
            onSubmit={() => setOpenModal(modalType.Close)}
            header="Edit the email account settings"
          />
          <DeleteEmail
            isOpen={openModal === modalType.DeleteEmail}
            setOpenModal={setOpenModal}
            onClose={closeModal}
            onSubmit={() => setOpenModal(modalType.Close)}
          />
        </TableContainer>
      )}
    </>
  );
}
