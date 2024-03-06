import React, { useState } from 'react';
import { HeaderTitle } from 'utils/typography';
import { Box, Button, Card, Divider, Grid, Typography } from '@mui/material';
import { useCampaign } from 'context/CampaignContext';
import DataList from 'pages/Databases/DataList';
import SaveContactsModal from 'components/modal/database/SaveContactsModal';
// import MenuOpenTwoToneIcon from '@mui/icons-material/MenuOpenTwoTone';
import ExportModal from 'components/modal/database/ExportModal';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
// import Layout from 'components/layout';
import WidgetsOutlinedIcon from '@mui/icons-material/WidgetsOutlined';
import { ApartmentOutlined } from '@mui/icons-material';
import { datas, header } from 'components/tables/DatabaseTable2';
import { useNotification } from 'context/NotificationContext';
import LayersOutlinedIcon from '@mui/icons-material/LayersOutlined';
import CollapseMenu from '../Collapse';

const Ecommerce = (props) => {
  const csvLink = {
    filename: 'file.csv',
    headers: header,
    data: datas,
  };
  const { campaigns } = useCampaign();
  const message = 'You will be charged 1 marketplace credit for every email.';
  // edit template functionalities
  const [open, setOpen] = useState(false);
  const { dash, setDash } = props;
  const [exports, setExports] = useState(false);
  const [expanded1, setExpanded1] = useState(false);
  const [expanded2, setExpanded2] = useState(false);
  const [expanded3, setExpanded3] = useState(false);
  const [expanded4, setExpanded4] = useState(false);

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

  const handleExportsClose = () => setExports(false);

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
      {' '}
      <Grid container spacing={2} mt={0.2}>
        <Grid item xs={2.4} sx={{ height: '90vh', overflow: 'scroll' }}>
          <HeaderTitle>eCommerce</HeaderTitle>
          {/* <Box sx={{ display: 'flex', justifyContent: 'space-between' }}> */}
          <Typography sx={{ fontSize: '1rem', fontWeight: 500, pt: 1.6 }}>Filter</Typography>

          <Divider sx={{ mt: 2 }} />
          <CollapseMenu
            icons={<ApartmentOutlined sx={{ color: '#FFBC01', fontSize: '1.5rem' }} />}
            name="Company"
            lable="Name"
            expanded={expanded1}
            setExpanded={setExpanded1}
          />
          <CollapseMenu
            icons={<WidgetsOutlinedIcon sx={{ color: '#FD71AF', fontSize: '1.5rem' }} />}
            name="Category"
            lable="Category"
            expanded={expanded2}
            setExpanded={setExpanded2}
          />
          <CollapseMenu
            icons={<LayersOutlinedIcon sx={{ color: '#4896FF', fontSize: '1.5rem' }} />}
            name="Platform"
            lable="Name"
            expanded={expanded3}
            setExpanded={setExpanded3}
          />
          <CollapseMenu
            icons={<LocationOnOutlinedIcon sx={{ color: '#00B783', fontSize: '1.5rem' }} />}
            name="Location"
            lable="City / State / Country / Zip"
            expanded={expanded4}
            setExpanded={setExpanded4}
          />

          <Box m={1} display="flex" justifyContent="center" alignItems="center">
            <Button variant="outlined" sx={{ height: 40, my: 1 }}>
              SEARCH
            </Button>
          </Box>
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

export default Ecommerce;
