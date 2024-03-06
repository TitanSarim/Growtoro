// import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import LogoutIcon from '@mui/icons-material/Logout';
import { Button, Divider, Menu, MenuItem } from '@mui/material';
// import account from '_mock/account';
import { modalType } from '_mock/defines';
import Logout from 'components/modal/Logout/Logout';
import { useUser } from 'context/UserContext';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export default function Account() {
  const [openModal, setOpenModal] = useState('');
  const { user } = useUser();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <Button
        onClick={handleClick}
        aria-controls={open ? 'basic-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        // startIcon={<AccountCircleOutlinedIcon />}
        startIcon={
          <img src={user.user.profile_image} alt="" style={{ height: '30px', width: '30px', borderRadius: '50%' }} />
        }
        sx={{
          color: 'black',
          minWidth: 'auto !important',
          paddingX: '1rem !important',
          fontWeight: 600,
          fontSize: '16px',
        }}
      >
        {user?.user.name}
      </Button>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
        transformOrigin={{ vertical: 'top', horizontal: 'center' }}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <MenuItem component={Link} to="/profile?tab=0" onClick={handleClose}>
          Settings
        </MenuItem>
        <Divider variant="middle" />
        <MenuItem
          onClick={() => {
            handleClose();
            setOpenModal(modalType.Logout);
          }}
        >
          Logout
          <LogoutIcon fontSize="2px" style={{ marginLeft: 3 }} />
        </MenuItem>
      </Menu>
      <Logout isOpen={openModal === 'Logout'} setOpenModal={setOpenModal} onClose={() => setOpenModal('')} />
    </>
  );
}
