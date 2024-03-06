import ContactMailIcon from '@mui/icons-material/ContactMail';
import FactoryIcon from '@mui/icons-material/Factory';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import MenuOpenTwoToneIcon from '@mui/icons-material/MenuOpenTwoTone';
import PortraitIcon from '@mui/icons-material/Portrait';
import { Box, Button, Divider, Grid, Typography } from '@mui/material';
import ExportModal from 'components/modal/database/ExportModal';
import SaveContactsModal from 'components/modal/database/SaveContactsModal';
import { useCampaign } from 'context/CampaignContext';


// eslint-disable-next-line import/no-unresolved
import DashboardLayout from 'layouts/dashboard/index';
import DataList from 'pages/Databases/DataList';
import React, { useState } from 'react';
import { useNotification } from 'context/NotificationContext';
import { HeaderTitle } from 'utils/typography';
import CollapseMenu from './Collapse';

const Database = () => {
  const { campaigns } = useCampaign();
  // edit template functionalities
  const [open, setOpen] = useState(false);
  const [dash, setDash] = useState(false);
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
    <DashboardLayout isCloseNav={dash}>
      <Grid container spacing={2} mt={0.2}>
        <Grid item xs={3} pt="0 !important">
          <HeaderTitle>Database</HeaderTitle>
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography sx={{ fontSize: '1rem', fontWeight: 500, pt: 1.6 }}>Filter</Typography>
            <Button
              variant={dash ? 'contained' : 'outlined'}
              startIcon={<MenuOpenTwoToneIcon />}
              sx={{ minWidth: '40px !important', ml: 0.2 }}
              onClick={() => setDash(!dash)}
            />
          </Box>
          <Divider sx={{ mt: 2 }} />
          <CollapseMenu
            icons={<PortraitIcon sx={{ color: '#4896FF', fontSize: '1.5rem' }} />}
            name="Name"
            lable="Name"
            expanded={expanded1}
            setExpanded={setExpanded1}
          />
          <CollapseMenu
            icons={<ContactMailIcon sx={{ color: '#FD71AF', fontSize: '1.5rem' }} />}
            name="Titles"
            lable="Titles"
            expanded={expanded2}
            setExpanded={setExpanded2}
          />
          <CollapseMenu
            icons={<FactoryIcon sx={{ color: '#FFBC01', fontSize: '1.5rem' }} />}
            name="Industry & Keywords"
            lable="Industry & Keywords"
            expanded={expanded3}
            setExpanded={setExpanded3}
          />
          <CollapseMenu
            icons={<LocationOnIcon sx={{ color: '#00B783', fontSize: '1.5rem' }} />}
            name="Location"
            lable="City / State / Country / Zip"
            expanded={expanded4}
            setExpanded={setExpanded4}
          />
          <Box m={1} display="flex" justifyContent="center" alignItems="center">
            <Button variant="outlined" sx={{ height: 40 }}>
              Filter
            </Button>
          </Box>
        </Grid>
        <Grid item xs={9}>
          <DataList
            handleOpen={handleOpen}
            setExports={setExports}
            handleClick={handleClick}
            exports={exports}
            campaigns={campaigns}
          />
        </Grid>
      </Grid>
      <SaveContactsModal data={{ open, setOpen, handleOpen, handleClose }} />
      <ExportModal data={{ exports, setExports, handleExportsOpen, handleExportsClose }} />
    </DashboardLayout>
  );
};

export default Database;
