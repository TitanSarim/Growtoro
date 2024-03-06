import { useState } from 'react';
// import { alpha } from '@mui/material/styles';
import { IconButton } from '@mui/material';
import { Link } from 'react-router-dom';

const setting = [
  {
    label: 'settings',
    icon: '/assets/icons/ic_settings.svg',
  },
];

export default function Settings() {
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
          ...(open &&
            {
              // bgcolor: (theme) => alpha(theme.palette.primary.main, theme.palette.action.focusOpacity),
            }),
        }}
      >
        <Link to="/profile?tab=0">
          <img src={setting[0].icon} alt={setting[0].label} />
        </Link>
      </IconButton>
    </>
  );
}
