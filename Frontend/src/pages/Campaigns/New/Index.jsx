import { useNavigate } from 'react-router-dom';
import { BsFillArrowLeftCircleFill } from 'react-icons/bs';
import { useState } from 'react';
import { Box, IconButton, TextField } from '@mui/material';

import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import Tab from '@mui/material/Tab';

// import Layout from 'components/layout';
import { tabitems } from '_mock/tabItems';
import { useCampaign } from 'context/CampaignContext';
import { HeaderTitle } from 'utils/typography';

const NewCampaigns = () => {
  const navigate = useNavigate();
  const { newCampaignTab, setNewCampaignTab, newCampaign, onNewCampaignInputChange } = useCampaign();

  const [editing, setEditing] = useState(false);

  const handleChange = (event, newValue) => {
    setNewCampaignTab(newValue);
  };

  console.log("tabitems", tabitems)


  return (
    <>
      <HeaderTitle>
        <BsFillArrowLeftCircleFill
          color="black"
          size={20}
          style={{ margin: '0px 8px' }}
          onClick={() => {
            navigate('/campaigns');
          }}
        />
        {editing ? (
          <TextField
            defaultValue={newCampaign?.campaign_name}
            onChange={(e) => onNewCampaignInputChange((prev) => ({ ...prev, campaign_name: e.target.value }))}
          />
        ) : (
          newCampaign?.campaign_name
        )}
        <IconButton onClick={() => setEditing(!editing)}>{editing ? <SaveIcon /> : <EditIcon />}</IconButton>
      </HeaderTitle>
      {/* <TabNav /> */}

      <Box sx={{ width: '100%', typography: 'body1' }}>
        <TabContext value={newCampaignTab}>
          {/* tabs */}
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <TabList onChange={handleChange}>
              {tabitems?.map((item) => (
                item.title !== 'Analytics' && (
                  <Tab sx={{ fontSize: 20 }} key={item.title} label={item.title} value={item.title} />
                )
              ))}
            </TabList>
          </Box>

          {/* tab panels */}
          {tabitems?.map((item) => (
            <TabPanel key={item.title} value={item.title} sx={{ height: 'calc(100vh - 270px)', padding: '0px' }}>
              {item.component}
            </TabPanel>
          ))}
        </TabContext>
      </Box>
    </>
  );
};

export default NewCampaigns;
