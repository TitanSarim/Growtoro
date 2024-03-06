import React, { useEffect, useState } from 'react';
import { Box, Grid, Stack, Typography } from '@mui/material';
import { thousandsSeparator } from 'utils/thousandsSeparator';
import CircularProgress from '@mui/material/CircularProgress';
import { HeaderTitle } from 'utils/typography';
import { APPLICATION_URL } from 'utils/constant';
import Api from 'api/Api';
import { useUser } from 'context/UserContext';

const PayAsYouGo = () => {
  // const [state, setState] = useState('');
  const [allData, setAllData] = useState();
  const [loading, setLoading] = useState(false);
  const { user } = useUser();

  const cardPricStyle = {
    fontSize: '36px',
    fontWeight: 700,
    color: '#7B68EE',
    '&:hover': {
      color: '#00B783',
    },
  };

  useEffect(() => {
    setLoading(true);
    Api.plan
      .getCreditPlan(user.tenant_id)
      .then((res) => {
        setAllData(res.data.plans.data);
      })
      .catch((err) => {
        console.log(err.response);
      })
      .finally(() => {
        setLoading(false);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return loading ? (
    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
      <CircularProgress />
    </Box>
  ) : (
    <Box width={'100%'} mx="auto">
      <Box textAlign={'center'} mb={4} mt={2}>
        <HeaderTitle>Need more credits?</HeaderTitle>
        <Typography>You can buy credits as one time puchases</Typography>
      </Box>

      <Grid container gap={2} justifyContent="center" mb={2}>
        {allData &&
          allData.map((data, index) => (
            <Grid
              key={index}
              item
              xs={12}
              lg={3.5}
              onClick={() => {
                window.location.href = `${APPLICATION_URL}pay-as-you-go/session?tenant_id=${user.tenant_id}&credit_id=${data.id}`;
              }}
            >
              <Stack
                direction={'row'}
                justifyContent="space-between"
                py={2}
                px={1}
                border="1px solid rgba(185, 190, 199, 0.6)"
                borderRadius={1}
                sx={{
                  '&:hover': {
                    cursor: 'pointer',
                  },
                }}
              >
                <Stack direction={'row'} justifyContent="space-between">
                  <span
                    style={{
                      height: '11px',
                      width: '11px',
                      backgroundColor: '#7B68EE',
                      borderRadius: '50%',
                      display: 'inline-block',
                      margin: '8px 8px 0 5px',
                    }}
                  />
                  <Box>
                    <Typography fontWeight={'bold'}>{thousandsSeparator(data.plan_credit)}</Typography>
                    <Typography>Custom Lead Credits</Typography>
                    {/* <Typography>{data.name}</Typography> */}
                  </Box>
                </Stack>

                <Typography sx={cardPricStyle}>
                  <span style={{ fontSize: '22px' }}>$</span>
                  {data.plan_amount}
                </Typography>
              </Stack>
            </Grid>
          ))}
      </Grid>
    </Box>
  );
};

export default PayAsYouGo;
