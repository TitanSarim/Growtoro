import TodayIcon from '@mui/icons-material/Today';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import { Box, Checkbox, Grid, ListItemText, MenuItem, Select, Stack, SvgIcon, Typography } from '@mui/material';
import Tab from '@mui/material/Tab';

import { analyticstabitems } from '_mock/tabItems';
import Api from 'api/Api';
import ErrorHandling from 'utils/ErrorHandling';
import { AddButton } from 'components/button/buttons';
// import SearchInput from 'components/input/SearchInput';
import NewCampaignNameModal from 'components/modal/campaign/NewCampaignNameModal';
import { useCampaign } from 'context/CampaignContext';
import { useNotification } from 'context/NotificationContext';
import { useUser } from 'context/UserContext';

import moment from 'moment/moment';
import ApexChart from 'pages/Campaigns/Components/ApexChart';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { HeaderTitle } from 'utils/typography';

const modalType = {
  name: 'name',
  close: 'close',
};

const Index = () => {
  const [analyticsTab, setAnalyticsTab] = useState(analyticstabitems[0].title);
  const [openModal, setOpenModal] = useState('');
  const navigate = useNavigate();
  const { user } = useUser();
  const { sendNotification } = useNotification();
  const { analyticsList, setNewCampaignTab, newCampaign, onNewCampaignInputChange } = useCampaign();

  const handleNewCampaignInit = (campaignName) => {
    onNewCampaignInputChange({ ...newCampaign, campaign_name: campaignName });
    navigate(`/campaigns/new`);
    setNewCampaignTab('Contacts');
    setOpenModal(modalType.close);
  };

  const handleChange = (event, newValue) => {
    setAnalyticsTab(newValue);
  };

  const names = [
    {
      time: 'This month',
      start_date: moment().startOf('month').format('YYYY-MM-DD'),
      end_date: moment().endOf('month').format('YYYY-MM-DD'),
    },
    {
      time: 'Last Month',
      start_date: moment().subtract(1, 'month').startOf('month').format('YYYY-MM-DD'),
      end_date: moment().subtract(1, 'month').endOf('month').format('YYYY-MM-DD'),
    },
    {
      time: 'This year',
      start_date: moment().startOf('year').format('YYYY-MM-DD'),
      end_date: moment().endOf('year').format('YYYY-MM-DD'),
    },
    {
      time: 'Last year',
      start_date: moment().subtract(1, 'year').startOf('year').format('YYYY-MM-DD'),
      end_date: moment().subtract(1, 'year').endOf('year').format('YYYY-MM-DD'),
    },
    {
      time: 'This week',
      start_date: moment().startOf('week').format('YYYY-MM-DD'),
      end_date: moment().endOf('week').format('YYYY-MM-DD'),
    },
    {
      time: 'Last week',
      start_date: moment().subtract(1, 'week').startOf('week').format('YYYY-MM-DD'),
      end_date: moment().subtract(1, 'week').endOf('week').format('YYYY-MM-DD'),
    },
    {
      time: 'Today',
      start_date: moment().startOf('day').format('YYYY-MM-DD'),
      end_date: moment().endOf('day').format('YYYY-MM-DD'),
    },
    {
      time: 'Yesterday',
      start_date: moment().subtract(1, 'day').startOf('day').format('YYYY-MM-DD'),
      end_date: moment().subtract(1, 'day').endOf('day').format('YYYY-MM-DD'),
    },
    {
      time: 'All time',
      start_date: '',
      end_date: '',
    },
  ];

  const [month1, setMonth1] = useState(names[8]);
  const [month2, setMonth2] = useState(names[8]);
  const [totalAnalytics, setTotalAnalytics] = useState();
  const [statsAnalytics, setStatsAnalytics] = useState();

  const counters = () => {
    Api.campaign
      .analyticsCounters(user?.tenant_id)
      .then((res) => setTotalAnalytics(res.data))
      .catch((e) => ErrorHandling({ e, sendNotification }));
  };

  const stats = () => {
    Api.campaign
      .analyticsStats(user?.tenant_id)
      .then((res) => setStatsAnalytics(res.data.analytics))
      .catch((e) => ErrorHandling({ e, sendNotification }));
  };

  useEffect(() => {
    analyticsList(user?.tenant_id);
    counters();
    stats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.tenant_id]);

  return (
    <>
      <HeaderTitle>Analytics</HeaderTitle>

      {/* All time /add new */}
      <Stack
        direction={{ xs: 'column', md: 'row' }}
        alignItems={{ xs: 'start', md: 'center' }}
        justifyContent="space-between"
      >
        <Stack direction="row" alignItems="center" gap={1}>
          <Box sx={{ p: 1, display: 'flex' }}>
            <Select
              value={month1.time}
              onChange={(e) => {
                setMonth1(e.target.value);
                Api.campaign
                  .analyticsCountersDate(user?.tenant_id, e.target.value.start_date, e.target.value.end_date)
                  .then((res) => setTotalAnalytics(res.data))
                  .catch((e) => ErrorHandling({ e, sendNotification }));
              }}
              style={{ height: '35px' }}
              renderValue={(value) => (
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <SvgIcon color="primary">
                    <TodayIcon sx={{ marginRight: '0.5rem', color: '#00B783' }} />
                  </SvgIcon>
                  {value}
                </Box>
              )}
            >
              {names.map((name, i) => (
                <MenuItem key={i} value={name}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Checkbox checked={month1.time === name.time} />
                    <ListItemText primary={name.time} />
                  </div>
                </MenuItem>
              ))}
            </Select>
          </Box>
        </Stack>
        <Stack direction="row" alignItems="center">
          {/* <SearchInput placeholder="Search by email or campaign" /> */}
          <AddButton onClick={() => setOpenModal(modalType.name)} />

          <NewCampaignNameModal
            title="Let's create a new campaign"
            placeholder="Campaign Name"
            isOpen={openModal === modalType.name}
            onSubmit={handleNewCampaignInit}
            onClose={() => setOpenModal(modalType.close)}
          />
        </Stack>
      </Stack>

      <Box sx={{ p: 2, background: '#ffffff', borderRadius: '5px', mb: 1, height: '75vh', overflow: 'auto' }}>
        {/* all widget */}
        <Widget totalAnalytics={totalAnalytics} />

        {/* all graph */}
        <Grid container spacing={2} columns={15} sx={{ marginTop: '1rem', marginBottom: '2rem' }}>
          <Grid item xs={15} sm={15} md={15}>
            <Box sx={{ border: '1px solid rgba(185, 190, 199, 0.6)', borderRadius: '5px', height: '100%' }}>
              <Box sx={{ p: 1 }}>
                <Select
                  value={month2.time}
                  onChange={(e) => {
                    setMonth2(e.target.value);
                    Api.campaign
                      .analyticsStatsDate(user?.tenant_id, e.target.value.start_date, e.target.value.end_date)
                      .then((res) => setStatsAnalytics(res.data.analytics))
                      .catch((e) => ErrorHandling({ e, sendNotification }));
                  }}
                  style={{ height: '35px' }}
                  renderValue={(value) => (
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <SvgIcon color="primary">
                        <TodayIcon sx={{ marginRight: '0.5rem', color: '#00B783' }} />
                      </SvgIcon>
                      {value}
                    </Box>
                  )}
                >
                  {names.map((name, i) => (
                    <MenuItem key={i} value={name}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Checkbox checked={month2.time === name.time} />
                        <ListItemText primary={name.time} />
                      </div>
                    </MenuItem>
                  ))}
                </Select>
              </Box>
              <ApexChart datas={statsAnalytics} />
            </Box>
          </Grid>
        </Grid>

        {/* campaign and account analytics table */}
        <Box sx={{ width: '100%', typography: 'body1' }}>
          <TabContext value={analyticsTab}>
            {/* campaign and account analytics title  */}
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <TabList onChange={handleChange}>
                {analyticstabitems?.map((item) => (
                  <Tab key={item.title} label={item.title} value={item.title} sx={{ fontSize: '2.5vh' }} />
                ))}
              </TabList>
            </Box>

            {analyticstabitems?.map((item) => (
              <TabPanel key={item.title} value={item.title} sx={{ padding: '0px' }}>
                {item.component}
              </TabPanel>
            ))}
          </TabContext>
        </Box>
      </Box>
    </>
    // </Layout>
  );
};

export default Index;

const Widget = ({ totalAnalytics }) => {
  const widgetContainer = {
    padding: '1rem 2rem',
    height: '100%',
    borderRadius: '5px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  };

  const widgetTitle = {
    fontSize: '1rem',
    fontWeight: 400,
    lineHeight: '1.2rem',
  };

  const widgetNumber = {
    fontSize: '2.2rem',
    fontWeight: 600,
    lineHeight: '3.8rem',
  };

  // const widgetBottom = {
  //   display: 'flex',
  //   alignItems: 'center',
  //   lineHeight: '1rem',
  //   fontWeight: 400,
  //   fontSize: '0.9rem',
  // };

  return (
    <Grid container spacing={2} columns={15}>
      <Grid item xs={15} sm={5} md={3}>
        <Box sx={{ background: 'rgba(0, 183, 131, 0.1)' }} style={widgetContainer}>
          <Typography color={'#333333'} sx={widgetTitle}>
            Total Sent
          </Typography>
          <Typography color={'#333333'} sx={widgetNumber}>
            {totalAnalytics?.total_sent || 0}
          </Typography>
          {/* <Typography color={'#00B783'} sx={widgetBottom}>
            <NorthIcon fontSize="small" />
            Up 189% (181)
          </Typography> */}
        </Box>
      </Grid>
      <Grid item xs={15} sm={5} md={3}>
        <Box sx={{ background: 'rgba(255, 188, 1, 0.1)' }} style={widgetContainer}>
          <Typography color={'#333333'} sx={widgetTitle}>
            Monthly Click Rate
          </Typography>
          <Typography color={'#333333'} sx={widgetNumber}>
            {totalAnalytics?.total_clicked || 0}
          </Typography>
        </Box>
      </Grid>
      <Grid item xs={15} sm={5} md={3}>
        <Box sx={{ background: 'rgba(253, 113, 175, 0.1)' }} style={widgetContainer}>
          <Typography color={'#333333'} sx={widgetTitle}>
            Opened
          </Typography>
          <Typography color={'#333333'} sx={widgetNumber}>
            {totalAnalytics?.total_opened || 0}
          </Typography>
        </Box>
      </Grid>
      <Grid item xs={15} sm={5} md={3}>
        <Box sx={{ background: 'rgba(123, 104, 238, 0.1)' }} style={widgetContainer}>
          <Typography color={'#333333'} sx={widgetTitle}>
            Replied
          </Typography>
          <Typography color={'#333333'} sx={widgetNumber}>
            {totalAnalytics?.total_replied || 0}
          </Typography>
        </Box>
      </Grid>
      <Grid item xs={15} sm={5} md={3}>
        <Box style={widgetContainer} sx={{ background: 'rgba(72, 150, 255, 0.1)' }}>
          <Typography color={'#333333'} sx={widgetTitle}>
            Unsubscribed
          </Typography>
          <Typography color={'#333333'} sx={widgetNumber}>
            {totalAnalytics?.total_unsubscribed || 0}
          </Typography>
        </Box>
      </Grid>
    </Grid>
  );
};
