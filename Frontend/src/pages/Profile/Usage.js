import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import { Box, Button, Card, CardContent, Divider, Grid, Icon, Slider, Typography } from '@mui/material';
import Api from 'api/Api';
import ErrorHandling from 'utils/ErrorHandling';
import { useNotification } from 'context/NotificationContext';
import { useUser } from 'context/UserContext';
import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { APPLICATION_URL } from 'utils/constant';

// function valuetext(value) {
//   return `${value}°C`;
// }

const Usage = () => {
  const { user } = useUser();
  const { sendNotification } = useNotification();

  const [isBilling, setIsBilling] = useState(true);
  const [value, setValue] = useState({ credits: 0 });
  const [datas, setDatas] = useState([]);

  useMemo(() => {
    Api.profile
      .usage(user.tenant_id)
      .then((response) => {
        const _addons =
          response.data?.active_addon_type === 'monthly'
            ? response.data.addons.filter((row) => row.id === response.data.active_addon)
            : response.data?.active_addon_type === 'yearly'
            ? response.data.yearly_addons.filter((row) => row.id === response.data.active_addon)
            : response.data.addons;
        if (response.data?.active_addon_type === 'yearly') {
          setIsBilling(false);
        }
        setValue(_addons[0] ? _addons[0] : value);
        setDatas(response.data);
      })
      .catch((e) => ErrorHandling({ e, sendNotification }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.tenant_id]);

  const handleBilling = (e) => {
    setIsBilling(!isBilling);
    const valueToSet = isBilling
      ? datas.active_addon_type === 'yearly'
        ? datas.yearly_addons.find((row) => row.id === datas.active_addon)
        : datas.yearly_addons[0]
      : datas.active_addon_type === 'monthly'
      ? datas.addons.find((row) => row.id === datas.active_addon)
      : datas.addons[0];

    setValue(valueToSet);
  };

  const handleSliderChange = (event, newValue) => {
    const x = isBilling
      ? datas.addons.filter((row) => row.credits === newValue)
      : datas.yearly_addons.filter((row) => row.credits === newValue);
    setValue(x[0]);
  };

  return (
    // <Box sx={{ mx: 3 }}>
    <Grid
      container
      spacing={2}
      sx={{
        mx: 3,
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}
    >
      {/* <Grid item xs={6}> */}
      <Grid item xs={6} sx={{ height: '70vh', overflowY: 'auto' }}>
        <Grid
          container
          sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Grid item width="100%" my={1}>
            <Card sx={{ boxShadow: 8 }}>
              <CardContent>
                <Typography variant="h4" sx={{ mb: 2 }}>
                  Uploaded Contacts
                </Typography>
                <Divider sx={{ my: 2 }} />
                {datas ? (
                  <Typography variant="body1" color="red" fontWeight="bold" sx={{ my: 1 }}>
                    {datas.uploaded_contacts} / {datas.max_contacts}
                  </Typography>
                ) : (
                  <Typography variant="body1" color="red" fontWeight="bold" sx={{ my: 1 }}>
                    0 / 76,000
                  </Typography>
                )}

                <Typography sx={{ mb: 1 }}>The number of total stored contacts from campaigns and lists</Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item width="100%" mt={1} mb={2}>
            <Card sx={{ boxShadow: 8 }}>
              <CardContent>
                <Typography variant="h4" sx={{ mb: 2 }}>
                  Sent Emails
                </Typography>
                <Divider sx={{ my: 2 }} />
                {datas ? (
                  <Typography variant="body1" color="red" fontWeight="bold" sx={{ my: 1 }}>
                    {datas.sent_emails} / {datas.max_sent_emails}
                  </Typography>
                ) : (
                  <Typography variant="body1" color="red" fontWeight="bold" sx={{ my: 1 }}>
                    0 / 76,000
                  </Typography>
                )}

                <Typography sx={{ mb: 1 }}>The number of total monthly emails you can send</Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item width="100%" mt={1} mb={2}>
            <Card sx={{ boxShadow: 8 }}>
              <CardContent>
                <Typography variant="h4" sx={{ mb: 2 }}>
                  Connected Emails
                </Typography>
                <Divider sx={{ my: 2 }} />
                {datas ? (
                  <Typography variant="body1" color="red" fontWeight="bold" sx={{ my: 1 }}>
                    {datas.connected_email}
                  </Typography>
                ) : (
                  <Typography variant="body1" color="red" fontWeight="bold" sx={{ my: 1 }}>
                    0 / 0
                  </Typography>
                )}

                <Typography sx={{ mb: 1 }}>The total number of connected email accounts </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item width="100%" mt={1} mb={1}>
            <Card sx={{ boxShadow: 8 }}>
              <CardContent>
                <Typography variant="h4" sx={{ mb: 2 }}>
                  Custom Lead Credits
                </Typography>
                <Divider sx={{ my: 2 }} />
                {datas ? (
                  <Typography variant="body1" color="red" fontWeight="bold" sx={{ my: 1 }}>
                    {datas.plan_credit}
                  </Typography>
                ) : (
                  <Typography variant="body1" color="red" fontWeight="bold" sx={{ my: 1 }}>
                    0
                  </Typography>
                )}

                <Typography sx={{ mb: 1 }}>
                  The total number of custom lead credits you have remaining for the month
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={6} style={{display: "none"}} width="100%">
        <Card sx={{ boxShadow: 8 }}>
          <CardContent>
            <Typography variant="h4" sx={{ mb: 1 }}>
              Increase plan limits
            </Typography>
            <Divider sx={{ my: 1 }} />
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                my: 2,
                border: '1px solid #C3B9B9',
                borderRadius: '20px',
                padding: '4px',
              }}
            >
              <Button
                variant={isBilling ? 'contained' : ''}
                sx={{
                  fontWeight: isBilling ? '600' : '400',
                  fontFamily: 'Inter',
                  minWidth: '50% !important',
                  borderRadius: '20px',
                }}
                size="medium"
                onClick={handleBilling}
              >
                Monthly billing
              </Button>
              <Button
                variant={isBilling ? '' : 'contained'}
                sx={{
                  fontWeight: isBilling ? '400' : '600',
                  fontFamily: 'Inter',
                  minWidth: '50% !important',
                  borderRadius: '20px',
                }}
                size="medium"
                onClick={handleBilling}
              >
                Annual billing
              </Button>
              <Button
                variant="contained"
                sx={{
                  minWidth: '75px !important',
                  maxHeight: '25px !important',
                  padding: '0 !important',
                  borderRadius: '20px',
                  zIndex: 99,
                  top: 32,
                  left: '-150px',
                  background: '#00B783',
                }}
                size="small"
              >
                Save 30%
              </Button>
            </Box>
            <Box sx={{ py: 2, px: 1, borderRadius: '5px' }}>
              <Slider
                value={value.credits}
                onChange={handleSliderChange}
                marks={
                  datas && isBilling
                    ? datas?.addons?.map((value) => ({
                        value: value.credits,
                      }))
                    : datas?.yearly_addons?.map((value) => ({
                        value: value.credits,
                      }))
                }
                min={datas?.addons ? (isBilling ? datas?.addons[0]?.credits : datas?.yearly_addons[0]?.credits) : 0}
                max={
                  datas?.addons
                    ? isBilling
                      ? datas?.addons[datas?.addons.length - 1]?.credits
                      : datas?.yearly_addons[datas?.yearly_addons.length - 1]?.credits
                    : 0
                }
                step={null}
                valueLabelDisplay="auto"
              />
            </Box>
            <Typography fontWeight={800} color="#8a8888a3">
              {/* Your current usage and add ons */}
              Usage Add Ons
            </Typography>
            <Grid container gap={1} sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
              <Grid
                items
                xs={1.5}
                sx={{ display: 'flex', height: '100%', alignItems: 'center', justifyContent: 'center' }}
              >
                <img
                  style={{
                    padding: 3,
                    borderRadius: '50%',
                    margin: 2,
                    background: 'rgb(239, 240, 242)',
                    height: '35px',
                    width: '35px',
                  }}
                  src="/assets/images/group.png"
                  alt=""
                />
              </Grid>
              <Grid items xs={9.5}>
                <Typography fontWeight={800}>{value.credits.toLocaleString()}</Typography>
                <Typography color="#8a8888a3" fontWeight={800} fontSize="14px">
                  Total contacts
                </Typography>
              </Grid>
            </Grid>
            <Grid container gap={1} sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
              <Grid
                items
                xs={1.5}
                sx={{ display: 'flex', height: '100%', alignItems: 'center', justifyContent: 'center' }}
              >
                <Icon
                  fontSize="large"
                  style={{
                    paddingTop: '4px',
                    padding: 3,
                    borderRadius: '50%',
                    margin: 2,
                    background: 'rgb(239, 240, 242)',
                    height: '35px',
                    width: '35px',
                  }}
                >
                  <EmailOutlinedIcon />
                </Icon>
              </Grid>
              <Grid items xs={9.5}>
                <Typography fontWeight={800}>{(value.credits * 6).toLocaleString()}</Typography>
                <Typography color="#8a8888a3" fontWeight={800} fontSize="14px">
                  Emails per month
                </Typography>
              </Grid>
            </Grid>
            <Typography sx={{ mt: 2 }} fontWeight={600} fontSize="14px">
              ${value.price} extra /{value?.interval_type === 'monthly' ? 'month' : 'annually'}
            </Typography>
            <Button
              variant="outlined"
              sx={{ mt: 1, width: '50%' }}
              disabled={value.id === datas.active_addon}
              component={Link}
              to={`${APPLICATION_URL}create-addon-session/${user.tenant_id}/${value.stripe_plan_id}`}
            >
              Update
            </Button>
          </CardContent>
        </Card>
                </Grid>
    </Grid>
    // </Box>
  );
};
export default Usage;
