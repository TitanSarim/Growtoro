import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Typography } from '@mui/material';

import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';

import Api from 'api/Api';
// import ErrorHandling from 'utils/ErrorHandling';
// import Layout from 'components/layout';
import { useUser } from 'context/UserContext';
import { HeaderTitle } from 'utils/typography';
// import { useNotification } from 'context/NotificationContext';

import Billing from './Billing';
import Usage from './Usage';
import Blocklist from './Blocklist';
import MyAccount from './MyAccount';
import PayAsYouGo from './PayAsYouGo';
import Subscription from './Subscription';

const Profile = () => {
  // const { sendNotification } = useNotification();
  const [value, setValue] = useState(0);
  const [data, setData] = useState({ plan_name: '', renew_date: '' });

  const location = useLocation();
  const { user } = useUser();
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  useEffect(() => {
    const search = location.search.split('=');
    if (search && search[1]) {
      const tabIndex = parseInt(search[1], 10);
      setValue(tabIndex);
    }
    Api.plan
      .getActivePlan(user.tenant_id)
      .then((res) => {
        setData(res.data.data);
      })
      .catch((e) => {
        console.log(e);
        // ErrorHandling({ e, sendNotification });
      });
  }, [location.search, user.tenant_id]);

  return (
    <>
      <Box sx={{ width: '100%', mx: 'auto', mt: 1 }}>
        <HeaderTitle>Hello, {user?.user.name}</HeaderTitle>
      </Box>

      <div>
        <Box sx={{ width: '100%' }}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
              <Tab
                sx={{
                  fontSize: '18px',
                }}
                label="My Account"
                disableFocusRipple
              />
              <Tab sx={{ fontSize: '18px' }} label="Billing" disableFocusRipple />
              <Tab sx={{ fontSize: '18px' }} label="Usage" disableFocusRipple />
              <Tab sx={{ fontSize: '18px' }} label="Subscription" disableFocusRipple />
              <Tab sx={{ fontSize: '18px' }} label="Pay As You Go" disableFocusRipple />
              <Tab sx={{ fontSize: '18px' }} label="Blocklist" disableFocusRipple />
            </Tabs>
          </Box>
          <Box
            sx={{
              height: { xs: '40vh', sm: '60vh', md: '66vh', lg: '75vh', xl: '80vh' },
              overflowY: 'auto',
            }}
          >
            <TabPanel value={value} index={0}>
              <MyAccount />
            </TabPanel>
            <TabPanel value={value} index={1}>
              <Billing _data={data} />
            </TabPanel>
            <TabPanel value={value} index={2}>
              <Usage />
            </TabPanel>
            <TabPanel value={value} index={3}>
              <Subscription _data={data} />
            </TabPanel>
            <TabPanel value={value} index={4}>
              <PayAsYouGo />
            </TabPanel>
            <TabPanel value={value} index={5}>
              <Blocklist />
            </TabPanel>
          </Box>
        </Box>
      </div>
    </>
  );
};

function TabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

export default Profile;
