import * as React from 'react';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import { useCampaign } from 'context/CampaignContext';
import { tabitems } from '_mock/tabItems';

export default function TabNav() {
  const { newCampaignTab, setNewCampaignTab } = useCampaign();

  const handleChange = (event, newValue) => {
    setNewCampaignTab(newValue);
  };
  return (
    <Box sx={{ width: '100%', typography: 'body1' }}>
      <TabContext value={newCampaignTab}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <TabList onChange={handleChange}>
            {tabitems?.map((item) => (
              <Tab sx={{ fontSize: 20 }} key={item.title} label={item.title} value={item.title} />
            ))}
          </TabList>
        </Box>
        {tabitems?.map((item) => (
          <TabPanel key={item.title} value={item.title} sx={{ height: 'calc(100vh - 270px)', padding: '0px' }}>
            {item.component}
          </TabPanel>
        ))}
      </TabContext>
    </Box>
  );
}
