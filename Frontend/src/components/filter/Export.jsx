import { Box, Button, Checkbox, Menu, MenuItem, Typography } from '@mui/material';
import { alpha, styled } from '@mui/material/styles';
import { useEffect, useRef, useState } from 'react';
import { CSVLink } from 'react-csv';
import { AiFillCaretDown } from 'react-icons/ai';
import { BsDownload } from 'react-icons/bs';
import { useNotification } from 'context/NotificationContext';

const StyledMenu = styled((props) => <Menu elevation={0} {...props} />)(({ theme }) => ({
  '& .MuiPaper-root': {
    borderRadius: 6,
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

export default function Export({ label, rows }) {
  const csvLinkRef = useRef();
  const { sendNotification } = useNotification();

  const [anchorEl, setAnchorEl] = useState(null);
  const [data, setData] = useState('');
  const [csvExportInfo, setCsvExportInfo] = useState({
    fileName: '',
  });
  // const [check1, setCheck1] = useState(false);
  // const [check2, setCheck2] = useState(false);

  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const activeCampaign = () => {
    const data = rows.filter((row) => row.status === 1);

    if (data.length < 1) {
      sendNotification({
        open: true,
        message: 'No active campaign found.',
        alert: 'error',
      });

      return;
    }

    setData(data);
    setCsvExportInfo({ fileName: 'active-data.csv' });

    setTimeout(() => {
      csvLinkRef.current.link.click();
      setCsvExportInfo({ fileName: '' });
    }, 50);
  };

  const deactiveCampaign = () => {
    const data = rows.filter((row) => row.status === 0);

    if (data.length < 1) {
      sendNotification({
        open: true,
        message: 'No deactive campaign found.',
        alert: 'error',
      });
      return;
    }

    setData(data);
    setCsvExportInfo({ fileName: 'deactive-data.csv' });

    setTimeout(() => {
      csvLinkRef.current.link.click();
      setCsvExportInfo({ fileName: '' });
    }, 50);
  };

  return (
    <div>
      <Button
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        disableElevation
        size="small"
        sx={{ color: '#333333', border: '2px solid #E9EBF0' }}
        onClick={handleClick}
        endIcon={<AiFillCaretDown />}
      >
        <BsDownload color="#FFBC01" size={20} style={{ marginRight: '8px' }} /> {label || 'Filter'}
      </Button>

      <StyledMenu anchorEl={anchorEl} open={open} onClose={handleClose}>
        {csvExportInfo.fileName === 'active-data.csv' && (
          <CSVLink data={data} filename={csvExportInfo.fileName} style={{ textDecoration: 'none' }} ref={csvLinkRef} />
        )}

        {csvExportInfo.fileName === 'deactive-data.csv' && (
          <CSVLink data={data} filename={csvExportInfo.fileName} style={{ textDecoration: 'none' }} ref={csvLinkRef} />
        )}

        <MenuItem
          onClick={() => {
            activeCampaign();
            handleClose();
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Checkbox disableRipple checked={false} />
            <Typography
              variant="body2"
              color="#212B36"
              sx={{ textDecoration: 'none' }}
              underline="none"
              className="MuiTypography-underlineNone"
            >
              Active
            </Typography>
          </Box>
        </MenuItem>

        <MenuItem
          onClick={() => {
            deactiveCampaign();
            handleClose();
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Checkbox disableRipple checked={false} />
            <Typography
              variant="body2"
              color="#212B36"
              sx={{ textDecoration: 'none' }}
              underline="none"
              className="MuiTypography-underlineNone"
            >
              Deactive
            </Typography>
          </Box>
        </MenuItem>

        {/* <MenuItem onClick={handleClose}>
          <Checkbox disableRipple />
          Archived
        </MenuItem>
        <MenuItem onClick={handleClose}>
          <Checkbox disableRipple sx={{ outline: 'red' }} />
          Disconnected
        </MenuItem> */}
      </StyledMenu>
    </div>
  );
}
