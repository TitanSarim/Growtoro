import { Box } from '@mui/material';
// import Logo from 'components/logo/Logo';
import NavSection from 'components/nav-section/NavSection';
import navConfig from './config';

export default function Nav({ isCloseNav }) {
  return (
    <Box
      sx={{
        height: '100%',
      }}
    >
      {!isCloseNav ? <NavSection data={navConfig} /> : ''}
      <Box sx={{ flexGrow: 1 }} />
    </Box>
  );
}
