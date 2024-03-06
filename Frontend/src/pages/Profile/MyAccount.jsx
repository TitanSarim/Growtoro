// import axios from 'axios';
import { useState } from 'react';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LoadingButton from '@mui/lab/LoadingButton';
import { Box, Button, Grid, InputAdornment, MenuItem, Select, TextField, Typography } from '@mui/material';
// import Alert from '@mui/material/Alert';

import Api from 'api/Api';
import { timezone } from '_mock/timezone';
import ErrorHandling from 'utils/ErrorHandling';

import { useNotification } from 'context/NotificationContext';
import { useUser } from 'context/UserContext';

const MyAccount = () => {
  const { user } = useUser();
  const { sendNotification } = useNotification();

  const [selectedTimezone, setSelectedTimezone] = useState(user?.user.time_zone || 'US/Pacific');
  const [_name, setName] = useState(user?.user?.name || '');
  // eslint-disable-next-line no-unused-vars
  const [mail, setMail] = useState(user?.user?.email || '');
  const [pass, setPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [loading, setLoading] = useState(false);
  const [profilePic, setProfilePic] = useState(null);
  const [profilePicName, setProfilePicName] = useState('');

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setProfilePic(file);
    setProfilePicName(file.name);
  };

  const handleTimeZone = (value) => {
    setSelectedTimezone(value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();

    formData.append('name', _name);
    formData.append('password', pass);
    formData.append('confirm_password', confirmPass);
    formData.append('time_zone', selectedTimezone);
    formData.append('file', profilePic);
    Api.profile
      .updateProfile(user.tenant_id, formData)
      .then((res) => {
        sendNotification({
          open: true,
          message: res.data.message,
          alert: 'success',
        });
        localStorage.setItem('user', JSON.stringify(res.data));
        window.location.reload();
      })
      .catch((e) => {
        ErrorHandling({ e, sendNotification });
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const userFromLocalStorage = JSON.parse(localStorage.getItem('user'));
  const timeZoneFromLocalStorage = userFromLocalStorage?.user?.time_zone;

  return (
    <Box>
      <form onSubmit={(e) => handleSubmit(e)}>
        <Grid container sx={{ justifyContent: 'center' }}>
          <Grid item xs={12} lg={4}>
            <Typography>Name</Typography>
            <TextField
              fullWidth
              required
              id="outlined-basic"
              sx={{ mb: '10px' }}
              variant="outlined"
              value={_name}
              onChange={(e) => setName(e.target.value)}
            />

            <Typography>Email</Typography>
            <TextField
              disabled
              sx={{ mb: '10px' }}
              fullWidth
              required
              id="outlined-basic"
              variant="outlined"
              value={mail}
            />

            <Typography>Password</Typography>
            <TextField
              fullWidth
              // required
              sx={{ mb: '10px' }}
              startAdornment={
                <InputAdornment position="start">
                  <AccountCircleIcon />
                </InputAdornment>
              }
              type="password"
              id="outlined-basic"
              variant="outlined"
              onChange={(e) => setPass(e.target.value)}
            />

            <Typography>Confirm Password</Typography>
            <TextField
              fullWidth
              // required
              sx={{ mb: '10px' }}
              startAdornment={
                <InputAdornment position="start">
                  <AccountCircleIcon />
                </InputAdornment>
              }
              type="password"
              id="outlined-basic"
              variant="outlined"
              onChange={(e) => setConfirmPass(e.target.value)}
            />

            <Box>
              <Typography>Time Zone</Typography>
              <Select defaultValue={timeZoneFromLocalStorage || 'US/Eastern'} sx={{ width: '100%' }}>
                <MenuItem value={'Select'}>Select</MenuItem>
                {Object.keys(timezone).map((_timezone) => (
                  <MenuItem key={_timezone} value={_timezone} onClick={() => handleTimeZone(_timezone)}>
                    {timezone[_timezone]}
                  </MenuItem>
                ))}
              </Select>
            </Box>
            <Box>
              <Typography sx={{ mt: 1.5 }}>Profile Picture</Typography>
              <label htmlFor="file">
                {/* <Stack
                direction="row"
                spacing={2}
                sx={{
                  alignItems: 'center',
                  cursor: 'pointer',
                  border: '1px solid #cccc',
                  height: '100%',
                  borderRadius: '6px',
                }}
              > */}
                <Grid
                  container
                  xs={12}
                  sx={{
                    alignItems: 'center',
                    cursor: 'pointer',
                    border: '1px solid #cccc',
                    height: '100%',
                    borderRadius: '6px',
                    zIndex: '-1',
                  }}
                >
                  <Grid item xs={5}>
                    <Button
                      style={{
                        backgroundColor: '#D6D3DE',
                        color: 'black',
                        zIndex: '-1',
                      }}
                      variant="contained"
                      fullWidth
                    >
                      Choose Picture
                    </Button>
                  </Grid>
                  <Grid item xs={7}>
                    <p
                      style={{
                        display: 'flex',
                        fontSize: '14px',
                        margin: '0',
                        padding: '6px',
                        overflow: 'hidden',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {profilePicName}
                    </p>
                  </Grid>
                </Grid>
                <input
                  type="file"
                  name="file"
                  id="file"
                  style={{ opacity: '0', visibility: 'hidden' }}
                  accept="image/*"
                  onChange={handleFileChange}
                />
                {/* </Stack> */}
              </label>
            </Box>
            <Box sx={{ textAlign: 'end', my: 1 }}>
              <LoadingButton variant="contained" type="submit" loading={loading}>
                {loading ? 'Loading' : 'Save'}
              </LoadingButton>
            </Box>
          </Grid>
        </Grid>
      </form>
    </Box>
  );
};

export default MyAccount;
