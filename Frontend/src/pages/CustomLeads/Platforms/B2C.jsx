import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import PanoramaFishEyeIcon from '@mui/icons-material/PanoramaFishEye';
import { Autocomplete, Box, Button, Chip, Grid, IconButton, TextField, Typography } from '@mui/material';
import { socialData } from '_mock/cusomleads';
import Api from 'api/Api';
import ErrorHandling from 'utils/ErrorHandling';
import FaqModal from 'components/modal/customLeads/FaqModal';
import { useNotification } from 'context/NotificationContext';
import { useUser } from 'context/UserContext';
// import { el } from 'date-fns/locale';
import { useState } from 'react';

const CustomLeadB2C = ({ faqData }) => {
  // const [active, setActive] = useState('Twitter');
  const [_accordData, setAccordData] = useState([]);

  const [info, setInfo] = useState({
    platform: 'Instagram',
    audiences: [],
    emails: '',
  });
  const [open, setOpen] = useState({
    openModal: '',
    loading: false,
  });
  const { user } = useUser();
  const { sendNotification } = useNotification();

  const handleClick = (value, object) => {
    setInfo((prev) => ({ ...prev, [object]: value }));
  };
  const submit = (e) => {
    e.preventDefault();
    setOpen((prev) => ({ ...prev, loading: true }));
    Api.leads.b2cRequest(user?.tenant_id, info).then((response) => {
      sendNotification({
        open: true,
        message: response.data.message,
        alert: 'success',
      });
    });

    setInfo((prev) => ({ ...prev, audiences: [], emails: '' }))
      .catch((e) => {
        ErrorHandling({ e, sendNotification });
      })
      .finally(() => {
        setOpen((prev) => ({ ...prev, loading: false }));
      });
  };

  return (
    <>
      <Typography variant="h6">Platform</Typography>
      <Grid container spacing={2} sx={{ pt: '2rem', justifyContent: 'center' }}>
        {socialData?.map((data, index) => (
          <Grid item xs={4} key={index}>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'column',
                background: '#FFFFFF',
                border: '1px solid rgba(185, 190, 199, 0.6)',
                borderRadius: '5px',
                p: '1.5rem',
              }}
              key={index}
              onClick={() => handleClick(data.name, 'platform')}
            >
              <img src={data.image} height="42px" width="42px" alt="warm" />
              <Typography
                variant="body1"
                sx={{
                  fontFamily: 'Inter',
                  fontStyle: 'normal',
                  fontWeight: 400,
                  fontSize: '16px',
                  lineHeight: '19px',
                  mt: '0.8rem',
                }}
              >
                {data.name}
              </Typography>
              {info.platform === data.name ? (
                <CheckCircleIcon sx={{ position: 'relative', top: 34, zIndex: 1, color: '#00B783' }} />
              ) : (
                <PanoramaFishEyeIcon
                  sx={{
                    position: 'relative',
                    top: 34,
                    zIndex: 1,
                    color: 'rgba(185, 190, 199, 0.6)',
                    background: 'white',
                  }}
                />
              )}
            </Box>
          </Grid>
        ))}
      </Grid>
      <form onSubmit={submit}>
        <Box sx={{ display: 'flex', pt: '2rem', alignItems: 'center' }}>
          {info.platform === 'YouTube' ? (
            <Typography variant="h6">Channels</Typography>
          ) : (
            <Typography variant="h6">Audiences</Typography>
          )}

          <IconButton
            onClick={() => {
              setOpen((prev) => ({ ...prev, openModal: 'faq' }));
              if (info.platform === 'YouTube') setAccordData(faqData.channel_faqs);
              else setAccordData(faqData.audiences_faqs);
            }}
            sx={{
              width: 20,
              height: 20,
              ml: 1,
            }}
          >
            <InfoOutlinedIcon fontSize="small" />
          </IconButton>
        </Box>
        {info.platform === 'YouTube' ? (
          <Typography sx={{ pt: '0.2rem' }}>Enter the exact YouTube channels you want full data from. We will only get the data of the channel owner (not the channel's subscribers).</Typography>
        ) : info.platform === 'Twitter' ? (
          <Typography sx={{ pt: '0.2rem' }}>Enter the exact @accounts you want emails from</Typography>
        ) : (
          <Typography sx={{ pt: '0.2rem' }}>Enter the exact @accounts or #hashtags you want emails from</Typography>
        )}

        <Autocomplete
          multiple
          id="standard"
          options={[]}
          freeSolo
          sx={{ maxHeight: '70px', overflowY: 'auto', overflowX: 'hidden', mb: 2 }}
          value={info.audiences}
          onChange={(e, v) => handleClick(v, 'audiences')}
          renderTags={(value, getTagProps) =>
            value.map((option, index) => (
              <Chip key={index} variant="outlined" label={option} {...getTagProps({ index })} />
            ))
          }
          renderInput={(params) => <TextField {...params} variant="standard" placeholder="" />}
        />
        <Typography variant="h7" fontWeight={800}>
          Number of emails
        </Typography>

        <TextField
          sx={{
            background: '#FFFFFF',
            border: '1px solid rgba(185, 190, 199, 0.6)',
            borderRadius: '5px',
            mt: '5px',
            mb: 2,
          }}
          type="number"
          value={info.emails}
          onChange={(e) => handleClick(e.target.value, 'emails')}
          fullWidth
          placeholder="Number of emails"
        />
        <Button
          variant="contained"
          sx={{
            height: 40,
            width: '50%',
            mt: 3,
            ml: 'auto',
            mr: 'auto',
            display: 'flex',
          }}
          type="submit"
          disabled={open.loading}
        >
          {open.loading ? 'Loading...' : 'SUBMIT'}
        </Button>
      </form>
      <FaqModal
        isOpen={open.openModal === 'faq'}
        setOpen={setOpen}
        onSubmit={() => {}}
        onClose={() => setOpen((prev) => ({ ...prev, openModal: '' }))}
        accordData={_accordData}
      />
    </>
  );
};

export default CustomLeadB2C;
