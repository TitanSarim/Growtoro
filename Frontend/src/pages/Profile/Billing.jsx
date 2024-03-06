import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Box, Button, Divider, Grid, Typography } from '@mui/material';

import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import TableBody from '@mui/material/TableBody';
import TableHead from '@mui/material/TableHead';
import TableContainer from '@mui/material/TableContainer';
import CircularProgress from '@mui/material/CircularProgress';

import { LoadingButton } from '@mui/lab';
import Dialog from '@mui/material/Dialog';
// import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
// import DialogTitle from '@mui/material/DialogTitle';

import Api from 'api/Api';
import { useUser } from 'context/UserContext';
import { APPLICATION_URL } from 'utils/constant';
import { useNotification } from 'context/NotificationContext';

import ModalsHeader from 'components/modal/emails/ModalsHeader';

const Billing = ({ _data }) => {
  const { user, setUserData, setData } = useUser();
  const { sendNotification } = useNotification();

  const [loading, setLoading] = useState(true);
  const [loadingCancelAccount, setLoadingCancelAccount] = useState(false);
  const [planData, setPlanData] = useState([]);
  const [modelOpen, setModelOpen] = useState(false);

  const data = ['HTML', 'PDF'];

  useEffect(() => {
    setLoading(true);
    Api.plan
      .getMyPlan(user.tenant_id)
      .then((res) => {
        setPlanData(res.data.order_history);
      })
      .catch((err) => {
        console.log(err.response);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [user?.tenant_id]);

  const handleCancelMyAccount = () => {
    setLoadingCancelAccount(true);

    Api.profile
      .deleteAccount(user?.tenant_id)
      .then((res) => {
        if (res.status === 200) {
          localStorage.removeItem('user');
          setUserData(null);
          setData(null);
          sendNotification({
            open: true,
            message: 'Account deleted successfully',
            alert: 'success',
          });
        }
      })
      .catch((err) => {
        console.log(err.response);
      })
      .finally(() => {
        handleClose();
        setLoadingCancelAccount(false);
      });
  };

  const handleOpen = () => {
    setModelOpen(true);
  };

  const handleClose = () => {
    setModelOpen(false);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <>
      <Grid
        container
        sx={{
          justifyContent: 'center',
          width: '100%',
        }}
      >
        <Grid item xs={12} lg={6}>
          {_data?.plan_name ? (
            <Box
              Box
              container
              sx={{
                width: '100%',
                margin: '35px auto',
                border: '1px solid rgba(185,190,199, 0.6)',
                borderRadius: '5px',
                padding: '10px 20px',
                textAlign: 'center',
              }}
            >
              <Typography>{planData?.plan?.plan_name}</Typography>
              <Typography>
                Next Payment ${planData?.plan?.plan_amount} (monthly) occurs on {_data.renew_date}
              </Typography>
              {/* <p>Next Payment ${planData?.plan?.plan_amount} (yearly) occurs on February 10, 2023</p> */}
              <Button
                variant="outlined"
                sx={{ mt: 2 }}
                onClick={() => {
                  Api.plan
                    .cancelPlan(user.tenant_id)
                    .then((res) => {
                      // console.log(res);
                    })
                    .catch((err) => {
                      console.log(err.response);
                    });
                }}
              >
                Cancel Subscription
              </Button>
            </Box>
          ) : (
            ''
          )}
          {/* Order History Table */}
          {planData && (
            <>
              <Typography variant="h6" sx={{ my: '10px' }}>
                Order History
              </Typography>
              <TableContainer component={Paper} sx={{ background: 'transparent!important' }}>
                <Table sx={{ minWidth: 650, background: 'transparent!important' }} aria-label="simple table">
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ color: 'black', fontWeight: '700', p: 0 }}>DATE</TableCell>
                      <TableCell sx={{ color: 'black', fontWeight: '700' }}>TYPE</TableCell>
                      <TableCell sx={{ color: 'black', fontWeight: '700' }}>RECEIPT</TableCell>
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {planData &&
                      planData?.map((singleData, index) => (
                        <TableRow key={index} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                          <TableCell component="th" scope="row" sx={{ p: 0 }}>
                            {singleData.date}
                          </TableCell>
                          <TableCell sx={{ p: 0 }}>{singleData.type}</TableCell>
                          <TableCell>
                            {/* {data.receipt.map((media, index) => ( */}
                            {data.map((media, index) => (
                              <Link key={index} style={{ margin: '0 2px' }}>
                                <span>{media}</span> {/* <span>{media}</span>{' '} */}
                              </Link>
                            ))}
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </>
          )}

          <Button
            variant="outlined"
            component={Link}
            // target="blank"
            to={`${APPLICATION_URL}stripe-client-portal/${user.tenant_id}`}
            sx={{ width: '40%', my: '20px', marginRight: '10px' }}
          >
            Update Credit Card
          </Button>

          <Button variant="outlined" color="error" onClick={() => handleOpen()}>
            Cancel My Account & Delete All of my Data
          </Button>

          <Dialog open={modelOpen} onClose={handleClose}>
            <ModalsHeader title="Are you sure?" handleClose={handleClose} />

            <Divider />

            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                This will delete all of your data and cannot be undone.
              </DialogContentText>
            </DialogContent>

            <Box my={4} width="60%" mx={'auto'} display="flex" justifyContent={'space-around'} gap={1}>
              <Button fullWidth onClick={handleClose} variant="outlined">
                No
              </Button>
              <LoadingButton
                component={Link}
                fullWidth
                variant="contained"
                onClick={handleCancelMyAccount}
                loading={loadingCancelAccount}
              >
                {loadingCancelAccount ? 'Loading' : 'Yes'}
              </LoadingButton>
            </Box>
          </Dialog>
        </Grid>
      </Grid>
    </>
  );
};

export default Billing;
