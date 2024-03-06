import { Typography } from '@mui/material';
import { Box } from '@mui/system';
import Logo from 'components/logo/Logo';

import { useUser } from 'context/UserContext';
import Notifications from './Notifications';
import Account from './Account';
import Settings from './Settings';
import Info from './Info';

const Nav = () => {
  const { data } = useUser();

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}
    >
      <Box sx={{ p: 2 }}>
        <Logo />
      </Box>
      <Box
        sx={{
          display: 'flex',
          gap: 3,
          paddingRight: 5,
          paddingY: 1,
          alignItems: 'center',
        }}
      >
        <Box sx={{ borderLeft: '4px solid #7b68ee', pl: 2 }}>
          <Typography
            variant="h6"
            fontSize="0.9rem"
            lineHeight={'19px'}
            fontWeight={500}
            color="#7b68ee"
            marginBottom={1}
          >
            Custom Lead Order Credits
          </Typography>
          {/* <Typography variant="subtitle2" lineHeight={'19px'}>
            {data?.used_credits || 0}
          </Typography> */}
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Typography variant="body1" lineHeight={'15px'}>
              {data?.total_credits || 0}/month
            </Typography>
            <Typography variant="body1" color="#7b68ee" lineHeight={'15px'}>
              {data?.custom_credits || 0}/one-time
            </Typography>
          </Box>
        </Box>

        <Info />
        <Settings />
        <Notifications />
        <Account />
      </Box>
    </Box>
  );
};

export default Nav;
