import ApartmentOutlinedIcon from '@mui/icons-material/ApartmentOutlined';
import CurrencyExchangeOutlinedIcon from '@mui/icons-material/CurrencyExchangeOutlined';
import GroupOutlinedIcon from '@mui/icons-material/GroupOutlined';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import PersonPinCircleOutlinedIcon from '@mui/icons-material/PersonPinCircleOutlined';
import SensorOccupiedIcon from '@mui/icons-material/SensorOccupied';
import YoutubeSearchedForIcon from '@mui/icons-material/YoutubeSearchedFor';
import { Box, Button, Card, Checkbox, Divider, Grid, TextField, Typography } from '@mui/material';
import { styled } from '@mui/system';
import ExportModal from 'components/modal/database/ExportModal';
import SaveContactsModal from 'components/modal/database/SaveContactsModal';
import { datas, header } from 'components/tables/DatabaseTable2';
import { useCampaign } from 'context/CampaignContext';
import { useNotification } from 'context/NotificationContext';
import DataList from 'pages/Databases/DataList';
import { useState } from 'react';
import { HeaderTitle } from 'utils/typography';
import AutocompleteField from '../AutocompleteField';
import CollapseMenu, { CollapseBar } from '../Collapse';

const Textfield = styled(TextField)({
  backgroundColor: 'white',
});
const B2B = (props) => {
  const csvLink = {
    filename: 'file.csv',
    headers: header,
    data: datas,
  };
  const { campaigns } = useCampaign();
  // edit template functionalities
  const [open, setOpen] = useState(false);
  const { dash, setDash } = props;
  const [exports, setExports] = useState(false);
  const [openPeople, setOpenPeople] = useState(true);
  const message = 'You will be charged 1 marketplace credit for every email.';

  const handleClick = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setExports(false);
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
  const [expanded1, setExpanded1] = useState(false);
  const [expanded2, setExpanded2] = useState(false);
  const [expanded3, setExpanded3] = useState(false);
  const [expanded4, setExpanded4] = useState(false);

  const handleOpen = () => {
    setOpen(!open);
  };
  const handleOpenPeople = () => {
    setOpenPeople(!openPeople);
    setExpanded1(false);
    setExpanded2(false);
    setExpanded3(false);
    setExpanded4(false);
  };

  return (
    // <Layout isCloseNav={dash}>
    <>
      <Grid container spacing={2} mt={0.2}>
        <Grid item xs={2.4} sx={{ height: '90vh', overflow: 'scroll' }}>
          <HeaderTitle>B2B</HeaderTitle>
          {/* <Box sx={{ display: 'flex', justifyContent: 'space-between' }}> */}
          <Typography sx={{ fontSize: '1rem', fontWeight: 500, pt: 1.6 }}>Filter</Typography>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', my: 1 }}>
            <Button
              variant={openPeople ? 'contained' : ''}
              sx={{ fontWeight: '400', fontFamily: 'Inter', minWidth: '50% !important' }}
              size="medium"
              onClick={handleOpenPeople}
            >
              People
            </Button>
            <Button
              variant={openPeople ? '' : 'contained'}
              sx={{ fontWeight: '400', fontFamily: 'Inter', minWidth: '50% !important' }}
              size="medium"
              onClick={handleOpenPeople}
            >
              Company
            </Button>
          </Box>
          <Divider sx={{ mt: 2 }} />
          {openPeople ? (
            <>
              <CollapseMenu
                icons={<YoutubeSearchedForIcon sx={{ color: '#FD71AF', fontSize: '1.5rem' }} />}
                name="Keywords"
                lable="Keywords"
                expanded={expanded1}
                setExpanded={setExpanded1}
              />
              <>
                <CollapseBar
                  icons={<PersonPinCircleOutlinedIcon sx={{ color: '#4896FF', fontSize: '1.5rem' }} />}
                  name="Personal"
                  expanded={expanded2}
                  setExpanded={setExpanded2}
                />
                <AutocompleteField label="Geography" expanded={expanded2} placeHolder="Select Options" />
                <AutocompleteField label="Industry" expanded={expanded2} placeHolder="Select Options" />
                <AutocompleteField label="Skill" expanded={expanded2} placeHolder="Select Options" />
                <AutocompleteField label="School" expanded={expanded2} placeHolder="Select Options" />
                <AutocompleteField label="Profile Language" expanded={expanded2} placeHolder="Select Options" />
              </>
              <>
                <CollapseBar
                  icons={<SensorOccupiedIcon sx={{ color: '#00B783', fontSize: '1.5rem' }} />}
                  name="Role"
                  expanded={expanded3}
                  setExpanded={setExpanded3}
                />
                <AutocompleteField label="Positions" expanded={expanded3} placeHolder="Select Options" />
                <AutocompleteField label="Seniority" expanded={expanded3} placeHolder="Select Options" />
                <AutocompleteField label="Function" expanded={expanded3} placeHolder="Select Options" />
                <AutocompleteField label="Years in Position" expanded={expanded3} placeHolder="Select Options" />
                <AutocompleteField label="Years in Company" expanded={expanded3} placeHolder="Select Options" />
                <AutocompleteField label="LinkedIn Group" expanded={expanded3} placeHolder="Select Options" />
              </>
              <>
                {' '}
                <CollapseBar
                  icons={<ApartmentOutlinedIcon sx={{ color: '#FFBC01', fontSize: '1.5rem' }} />}
                  name="Company"
                  expanded={expanded4}
                  setExpanded={setExpanded4}
                />
                <AutocompleteField label="Current Company" expanded={expanded4} placeHolder="Select Options" />
                <AutocompleteField label="Company Size" expanded={expanded4} placeHolder="Select Options" />
                <AutocompleteField label="Company Headquarters" expanded={expanded4} placeHolder="Select Options" />
              </>
            </>
          ) : (
            <>
              <CollapseMenu
                icons={<YoutubeSearchedForIcon sx={{ color: '#FD71AF', fontSize: '1.5rem' }} />}
                name="Keywords"
                lable="Keywords"
                expanded={expanded1}
                setExpanded={setExpanded1}
              />
              <>
                <CollapseBar
                  icons={<LocationOnOutlinedIcon sx={{ color: '#4896FF', fontSize: '1.5rem' }} />}
                  name="Locations"
                  expanded={expanded2}
                  setExpanded={setExpanded2}
                />
                <AutocompleteField label="Headquarters Location" expanded={expanded2} placeHolder="Select Options" />
                <AutocompleteField label="Industry" expanded={expanded2} placeHolder="Select Options" />
              </>

              <>
                <CollapseBar
                  icons={<CurrencyExchangeOutlinedIcon sx={{ color: '#00B783', fontSize: '1.5rem' }} />}
                  name="Revenue"
                  expanded={expanded3}
                  setExpanded={setExpanded3}
                />
                {expanded3 ? (
                  <>
                    <AutocompleteField label="Revenue" expanded={expanded3} placeHolder="USD" />
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 1, mt: 1 }}>
                      <Textfield id="standard-basic" placeholder="Min(MM)" />
                      <Textfield id="standard-basic" placeholder="Max(MM)" />
                    </Box>
                  </>
                ) : (
                  ''
                )}
              </>

              <>
                <CollapseBar
                  icons={<GroupOutlinedIcon sx={{ color: '#FFBC01', fontSize: '1.5rem' }} />}
                  name="Headcount"
                  expanded={expanded4}
                  setExpanded={setExpanded4}
                />
                {expanded4 ? (
                  <>
                    {' '}
                    <AutocompleteField label="Company Headcount" expanded={expanded4} placeHolder="Select Options" />
                    <Typography variant="body2">Headcount Grows</Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 1, mt: 1 }}>
                      <Textfield id="standard-basic" placeholder="From %" />
                      <Textfield id="standard-basic" placeholder="To %" />
                    </Box>
                    <AutocompleteField label="Department Headcounts" expanded={expanded4} placeHolder="Accounting" />
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 1, mt: 1 }}>
                      <Textfield id="standard-basic" placeholder="Min" />
                      <Textfield id="standard-basic" placeholder="Max" />
                    </Box>
                    <AutocompleteField label="Department Grows" expanded={expanded4} placeHolder="Accounting" />
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 1, mt: 1 }}>
                      <Textfield id="standard-basic" placeholder="From %" />
                      <Textfield id="standard-basic" placeholder="To %" />
                    </Box>
                    <Box display="grid">
                      <Box>
                        <Checkbox label="Label" />
                        Hiring Activities
                      </Box>
                      <Box>
                        <Checkbox label="Label" />
                        Funding Events
                      </Box>
                    </Box>
                  </>
                ) : (
                  ''
                )}
              </>
            </>
          )}
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
    // </Layout>
  );
};

export default B2B;
