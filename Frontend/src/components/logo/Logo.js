// @mui
import { Box, Link } from '@mui/material';

// ----------------------------------------------------------------------

const Logo = () => (
  <Link to="/" sx={{ display: 'contents' }}>
    <Box sx={{ maxHeight: '60px', maxWidth: '204px' }}>
      {/* <Box sx={{ maxHeight: '42px', maxWidth: '150px' }}> */}
      <img src="/assets/images/Frame.png" alt="" height="100%" width="100%" />
    </Box>
  </Link>
);

export default Logo;
