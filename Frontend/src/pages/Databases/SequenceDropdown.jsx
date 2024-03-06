import * as React from 'react';
import { styled, alpha } from '@mui/material/styles';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { AiFillTag, AiFillCaretDown, AiOutlinePlusCircle } from 'react-icons/ai';

import SendIcon from '@mui/icons-material/Send';
import { Typography } from '@mui/material';

const StyledMenu = styled((props) => <Menu elevation={0} {...props} />)(({ theme }) => ({
  '& .MuiPaper-root': {
    borderRadius: 20,
    marginTop: theme.spacing(1),
    minWidth: 180,
    color: theme.palette.mode === 'light' ? 'rgb(55, 65, 81)' : theme.palette.grey[300],
    boxShadow:
      'rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px',
    '& .MuiMenu-list': {
      padding: '4px 0',
    },
    '& .MuiMenuItem-root': {
      '& .MuiSvgIcon-root': {
        fontSize: 18,
        color: theme.palette.text.secondary,
        marginRight: theme.spacing(1.5),
      },
      '&:active': {
        backgroundColor: alpha(theme.palette.primary.main, theme.palette.action.selectedOpacity),
      },
    },
  },
}));

export default function SequenceDropdown({ label, leftIcon }) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      <Button
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        disableElevation
        size="medium"
        sx={{ color: '#333333', border: '2px solid #E9EBF0', height: 35 }}
        onClick={handleClick}
        endIcon={<AiFillCaretDown />}
        disableRipple
        disableFocusRipple
      >
        {leftIcon || <AiFillTag color="#7B68EE" size={20} style={{ marginRight: '8px' }} />}
        <Typography variant="body2" fontWeight="bold">
          {label || 'Filter'}
        </Typography>
      </Button>

      <StyledMenu anchorEl={anchorEl} open={open} onClose={handleClose}>
        <MenuItem onClick={handleClose}>
          <SendIcon color="#7B68EE" />
          Add to existing sequence
        </MenuItem>
        <MenuItem onClick={handleClose}>
          <AiOutlinePlusCircle style={{ margin: '0 10px 0 0', color: '#7B68EE' }} />
          Add to new sequence
        </MenuItem>
      </StyledMenu>
    </div>
  );
}
