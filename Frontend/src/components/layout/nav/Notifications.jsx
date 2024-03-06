import { useState } from 'react';
// @mui
import { alpha } from '@mui/material/styles';
import { IconButton } from '@mui/material';

const noti = [
  {
    label: 'notification',
    icon: '/assets/icons/ic_notification.svg',
  },
];

export default function Notifications() {
  const [open, setOpen] = useState(null);

  const handleOpen = (event) => {
    setOpen(event.currentTarget);
  };

  return (
    <>
      <IconButton
        onClick={handleOpen}
        sx={{
          padding: 0,
          width: 24,
          height: 24,
          ...(open && {
            bgcolor: (theme) => alpha(theme.palette.primary.main, theme.palette.action.focusOpacity),
          }),
        }}
      >
        <img src={noti[0].icon} alt={noti[0].label} />
      </IconButton>
    </>
  );
}
