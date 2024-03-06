import { useEffect, useState } from 'react';
import { useUser } from 'context/UserContext';
import { Box, Grid } from '@mui/material';

import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';

import Api from 'api/Api';
import ConfirmPlanModal from '../../components/modal/profile/subscription/ConfirmPlanModal';

const Subscription = ({ _data }) => {
  const { tenantId, user, cardNumber, cvc, expMonth, expYear } = useUser();

  const [plan, setPlan] = useState(0);
  const [loading, setLoading] = useState(true);

  // edit template functionalities
  const [open, setOpen] = useState(false);
  const [subscriptionData, setSubscriptionData] = useState([]);

  // take template data and set it to editData state and send it to modal for editing
  const handleOpen = (plan) => {
    setPlan(plan);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handlePurchase = () => {
    Api.plan
      .purchasePlan(tenantId, {
        plan_id: plan,
        card_number: cardNumber,
        exp_month: expMonth,
        exp_year: expYear,
        cvc,
      })
      .then((res) => res.plans.data)
      .then(setOpen(false))
      .catch((err) => console.log(err.response));
  };

  useEffect(() => {
    Api.plan
      .getAllSubscriptionPlans(user.tenant_id)
      .then((res) => {
        const plan = res.data.data;
        setSubscriptionData(plan);
      })
      .catch((err) => {
        console.log(err.response);
      })
      .finally(() => {
        setLoading(false);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Grid container xs={12} columnSpacing={{ xs: 0.8, sm: 1, md: 1.5 }}>
      {subscriptionData &&
        subscriptionData.map((data, key) => (
          <Grid item md={6} lg={3} key={key} sx={{ marginBottom: 1.5 }}>
            {/* <div > */}
            <Card
              sx={{
                padding: '0.3rem 1rem',
                border: _data.plan_id === data.id ? '1px solid blue' : '',

                '@media (min-width:600px)': {
                  height: '400px!important',
                },
                '@media (min-width:960px)': {
                  height: '430px!important',
                },
                '@media (min-width:1280px)': {
                  height: '420px!important',
                },
              }}
            >
              <CardContent sx={{ p: 0 }}>
                <div style={{ margin: '15px 0' }}>
                  <Typography
                    // variant="h2"
                    sx={{
                      color: '#6941c6',
                      fontSize: '1.25rem',
                      fontWeight: 600,
                      lineHeight: 1.5,
                    }}
                  >
                    {data.plan_name}
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: '2.3rem',
                      fontFamily: 'Inter',
                      fontWeight: '600',
                      alignItems: 'center',
                      display: 'flex',
                    }}
                  >
                    {/* {data.plan_amount ? (



                      <span
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 3,
                        }}
                      >
                        <div style={{ fontWeight: 'bold' }}>$</div>
                        {data.plan_amount}
                      </span>
                    ) : (
                      <span style={{ fontSize: '40px' }}>
                        <span style={{ display: 'inline-block', margin: '18px 0' }}>On Request</span>
                      </span>
                    )} */}

                    <span
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 3,
                      }}
                    >
                      <div style={{ fontWeight: 'bold' }}>$</div>
                      {data.plan_amount}
                    </span>

                    {/* </Typography>

                          <Typography */}
                    <span
                      style={{
                        fontSize: '1.875rem',
                      }}
                      // component="p"
                    >
                      {data.yearly ? `monthly/ ${data.yearly} yearly` : '/mo'}
                    </span>
                  </Typography>
                  <Button
                    variant={_data.plan_id === data.id ? 'contained' : 'outlined'}
                    sx={{
                      // color: 'white',
                      fontWeight: '400',
                      boxShadow: '0',
                      textTransform: 'uppercase',
                      width: '90%',
                      height: 46,
                      my: 3,
                      display: 'flex',
                      mx: 'auto',

                      ':hover': {
                        // color: 'white',
                        boxShadow: '5',
                      },
                    }}
                    onClick={() => (_data.plan_id === data.id ? '' : handleOpen(data))}
                  >
                    {_data.plan_id === data.id ? 'Current Plan' : 'Choose Plan'}
                  </Button>
                </div>
                <Typography sx={{ fontWeight: '600', mb: 3 }}>What's included:</Typography>
                <div>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      mb: 1,
                      color: '#475467',
                    }}
                  >
                    <img src="/assets/icons/tick.svg" alt="" /> {data.plan_number_email} emails sent
                  </Box>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      mb: 1,
                      color: '#475467',
                    }}
                  >
                    <img src="/assets/icons/tick.svg" alt="" /> {data.plan_number_users} active contacts
                  </Box>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      mb: 1,
                      color: '#475467',
                    }}
                  >
                    <img src="/assets/icons/tick.svg" alt="" />
                    {data.email_account === -1 ? 'Unlimited' : data.email_account} connected email accounts
                  </Box>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      mb: 2,
                      color: '#475467',
                    }}
                  >
                    <img src="/assets/icons/tick.svg" alt="" />
                    {data.plan_credit} custom email credits
                  </Box>
                </div>
              </CardContent>
            </Card>
            {/* </div> */}
          </Grid>
        ))}
      <ConfirmPlanModal data={{ open, setOpen, handleOpen, handleClose, handlePurchase, plan }} />
    </Grid>
  );
};

export default Subscription;
