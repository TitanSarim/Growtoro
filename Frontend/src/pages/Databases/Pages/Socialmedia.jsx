import React, { useState } from 'react';
import { HeaderTitle } from 'utils/typography';
import { Box, Button, Card, Collapse, Divider, Grid, Slider, Typography } from '@mui/material';
import { useCampaign } from 'context/CampaignContext';
import DataList from 'pages/Databases/DataList';
// import Layout from 'components/layout';
import SaveContactsModal from 'components/modal/database/SaveContactsModal';
import ExportModal from 'components/modal/database/ExportModal';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
// import TagIcon from '@mui/icons-material/Tag';
import YoutubeSearchedForIcon from '@mui/icons-material/YoutubeSearchedFor';
import GroupOutlinedIcon from '@mui/icons-material/GroupOutlined';
import AlternateEmailIcon from '@mui/icons-material/AlternateEmail';
import { datas, header } from 'components/tables/DatabaseTable2';
import { useNotification } from 'context/NotificationContext';
import CollapseMenu, { CollapseBar } from '../Collapse';

const Socialmedia = (props) => {
  const csvLink = {
    filename: 'file.csv',
    headers: header,
    data: datas,
  };
  const { campaigns } = useCampaign();
  const message = 'You will be charged 1 marketplace credit for every email.';
  const { dash, setDash } = props;

  // edit template functionalities
  const [open, setOpen] = useState(false);
  const [exports, setExports] = useState(false);
  const [expanded1, setExpanded1] = React.useState(false);
  const [expanded2, setExpanded2] = React.useState(false);
  const [expanded3, setExpanded3] = React.useState(false);
  const [expanded4, setExpanded4] = React.useState(false);

  const handleClick = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setExports(false);
  };

  // take template data and set it to editData state and send it to modal for editing
  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => setOpen(false);

  const handleExportsClose = () => {
    setExports(false);
  };

  const { sendNotification } = useNotification();

  const handleExportsOpen = () => {
    setExports(true);
    sendNotification({
      open: true,
      message: 'CSV Exported',
      alert: 'warning',
    });
    setExports(false);
  };

  return (
    <>
      <Grid container spacing={2} mt={0.2}>
        <Grid item xs={2.4} sx={{ height: '90vh', overflow: 'scroll' }}>
          <HeaderTitle>Social Media</HeaderTitle>
          {/* <Box sx={{ display: 'flex', justifyContent: 'space-between' }}> */}
          <Typography sx={{ fontSize: '1rem', fontWeight: 500, pt: 1.6 }}>Filter</Typography>
          {/* <Button
              variant={dash ? 'contained' : 'outlined'}
              startIcon={<MenuOpenTwoToneIcon />}
              sx={{
                minWidth: '40px !important',
                ml: 0.2,
              }}
              onClick={() => setDash(!dash)}
            /> */}
          {/* </Box> */}
          <Divider sx={{ mt: 2 }} />
          <CollapseMenu
            icons={<AlternateEmailIcon sx={{ color: '#4896FF', fontSize: '1.5rem' }} />}
            name="Account"
            lable="Account or Hashtag"
            expanded={expanded1}
            setExpanded={setExpanded1}
          />
          <CollapseMenu
            icons={<YoutubeSearchedForIcon sx={{ color: '#FD71AF', fontSize: '1.5rem' }} />}
            name="Categories"
            lable="Category"
            expanded={expanded2}
            setExpanded={setExpanded2}
          />
          <CollapseMenu
            icons={<LocationOnOutlinedIcon sx={{ color: '#00B783', fontSize: '1.5rem' }} />}
            name="Location"
            lable="City / State / Country / Zip"
            expanded={expanded3}
            setExpanded={setExpanded3}
          />
          <>
            <CollapseBar
              icons={<GroupOutlinedIcon sx={{ color: '#FFBC01', fontSize: '1.5rem' }} />}
              name="# of followers"
              expanded={expanded4}
              setExpanded={setExpanded4}
            />
            <Collapse in={expanded4} timeout="auto" unmountOnExit>
              <Box sx={{ pt: '2rem', px: 2, background: 'rgba(185, 190, 199, 0.2)', borderRadius: '5px' }}>
                <Slider
                  aria-label="Always visible"
                  min={0}
                  defaultValue={50000}
                  max={10000000}
                  step={10}
                  valueLabelDisplay="on"
                  sx={{ py: 0 }}
                />
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography>0</Typography>
                  <Typography>10,000,000</Typography>
                </Box>
              </Box>
            </Collapse>
          </>
          <Grid container direction="column" gap={1} my={1}>
            <Grid item>
              <Button variant="outlined" sx={{ height: 40, width: '100%' }}>
                SEARCH
              </Button>
            </Grid>
            <Grid item>
              <Button variant="contained" sx={{ height: 40, width: '100%' }}>
                CUSTOM
              </Button>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={9.6}>
          <Card sx={{ height: '100vh', width: '100%' }}>
            <DataList
              handleOpen={handleOpen}
              setExports={setExports}
              handleClick={handleClick}
              exports={exports}
              campaigns={campaigns}
              height={'84vh'}
              numOfRow={10}
              dash={dash}
              setDash={setDash}
            />
          </Card>
        </Grid>
      </Grid>
      <SaveContactsModal data={{ open, setOpen, handleOpen, handleClose }} />
      {exports && (
        <ExportModal data={{ csvLink, exports, setExports, handleExportsOpen, handleExportsClose, message }} />
      )}
    </>
  );
};

export default Socialmedia;
