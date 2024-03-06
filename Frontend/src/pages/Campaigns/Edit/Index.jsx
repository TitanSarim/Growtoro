import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import { Box, IconButton, TextField } from '@mui/material';
import Tab from '@mui/material/Tab';

// import Layout from 'components/layout';
import { useCampaign } from 'context/CampaignContext';
import { useState, useEffect } from 'react';
import { BsFillArrowLeftCircleFill } from 'react-icons/bs';
import { useNavigate, useParams } from 'react-router-dom';
import { HeaderTitle } from 'utils/typography';
import { tabitems } from '_mock/tabItems';
import Loading from 'components/Loading';
import { useUser } from 'context/UserContext';

const EditCampaigns = () => {
  const [editing, setEditing] = useState(false);
  const {
    newCampaignTab,
    setNewCampaignTab,
    newCampaign,
    isLoading,
    onNewCampaignInputChange,
    getCampaignById,
    updateCampaign,
  } = useCampaign();

  const { id } = useParams();
  const { user } = useUser();
  const navigate = useNavigate();

  const handleChange = (event, newValue) => {
    setNewCampaignTab(newValue);
  };

  useEffect(() => {
    getCampaignById(user?.tenant_id, id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.tenant_id, id]);

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
            style={{ width: '330px', height: '50px !important' }}
            defaultValue={newCampaign?.campaign_name}
            onChange={(e) => {
              onNewCampaignInputChange((prev) => ({ ...prev, campaign_name: e.target.value }));
            }}
          />
        ) : (
          newCampaign?.campaign_name
        )}
        <IconButton onClick={() => setEditing(!editing)}>
          {editing ? (
            <SaveIcon
              onClick={() => {
                updateCampaign(user?.tenant_id, {}, false);
                setEditing(!editing);
              }}
            />
          ) : (
            <EditIcon />
          )}
        </IconButton>
      </HeaderTitle>
      {/* <TabNav /> */}

      {isLoading?.getCampaignById ? (
        <Box sx={{ width: '100%', height: '150%', display: 'flex' }}>
          <Loading />
        </Box>
      ) : (
        <Box sx={{ width: '100%', typography: 'body1' }}>
          <TabContext value={newCampaignTab}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <TabList onChange={handleChange}>
                {tabitems?.map((item) => (
                  <Tab sx={{ fontSize: 20 }} key={item?.title} label={item?.title} value={item?.title} />
                ))}
              </TabList>
            </Box>
            {tabitems?.map((item) => (
              <TabPanel key={item?.title} value={item?.title} sx={{ height: 'calc(100vh - 270px)', padding: '0px' }}>
                {item?.component}
              </TabPanel>
            ))}
          </TabContext>
        </Box>
      )}
    </>
  );
};

export default EditCampaigns;
