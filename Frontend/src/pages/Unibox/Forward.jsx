import {
  Autocomplete,
  Box,
  Button,
  Checkbox,
  Chip,
  Divider,
  FormControl,
  FormControlLabel,
  FormGroup,
  Grid,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { useEmail } from 'context/EmailContext';
import { useEffect, useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

// const style = {
//   position: 'absolute',
//   top: '50%',
//   left: '50%',
//   transform: 'translate(-50%, -50%)',
//   maxWidth: 900,
//   width: '100%',
//   bgcolor: 'background.paper',
//   boxShadow: 24,
//   borderRadius: 2,
//   p: '25px 45px',
// };

const inputStyle = {
  width: '80%',
};
// const label = { inputProps: { 'aria-label': 'Checkbox demo' } };

const Forward = (props) => {
  const { onSubmit, onClose, messageDetail, isLoading } = props;
  const { emails } = useEmail();

  const [data, setData] = useState({
    id: messageDetail.id,
    smtp_id: messageDetail.emails[0].smtp_id,
    cc: '',
    bcc: '',
    to_mail: [],
    subject: messageDetail.emails[0].Re,
    body: messageDetail.emails[0].emailBody.replace(/\\n/g, '<br/>'),
    follow_up_days: 0,
    follow_up_status: false,
    email: messageDetail.emails[0].email,
    isCc: false,
    isBcc: false,
  });

  useEffect(() => {
    setData({
      id: messageDetail.id,
      smtp_id: messageDetail.emails[0].smtp_id,
      cc: '',
      bcc: '',
      to_mail: [],
      subject: messageDetail.emails[0].Re,
      body: messageDetail.emails[0].emailBody.replace(/\\n/g, '<br/>'),
      follow_up_days: 0,
      follow_up_status: false,
      email: messageDetail.emails[0].email,
      isCc: false,
      isBcc: false,
    });
  }, [messageDetail]);

  const handleChange = (event, name) => {
    setData((prev) => ({
      ...prev,
      [name]: event,
    }));
  };

  const submit = () => {
    onSubmit(data);
  };

  const options = emails
    .filter((data) => data?.status === 1)
    .map((data) => ({
      id: data?.id,
      value: data?.smtp_from_email,
    }));

  const onChangeHandler = (event, newValue) => {
    const email = emails.filter((_email) => _email.id === newValue?.id);
    setData((prev) => ({
      ...prev,
      smtp_id: email[0].id,
      email: email[0].smtp_from_email,
    }));
  };
  
  return (
    <Box>
      <Stack mb={1} p={1} bgcolor={'white'}>
        <Box sx={{ display: 'flex', alignItems: 'center', py: 1, justifyContent: 'space-between' }}>
          <Grid container alignItems={'center'}>
            <Grid item xs={0.5}>
              <Typography>
                <span style={{ color: '#7C828D', paddingRight: '0.8rem' }}>To: </span>
              </Typography>
            </Grid>
            <Grid item xs={10.5}>
              <Autocomplete
                multiple
                id="standard"
                options={[]}
                freeSolo
                sx={{ maxHeight: '70px', width: '100%', overflowY: 'auto', overflowX: 'hidden' }}
                value={data.to_mail}
                onChange={(e, v) => setData((prev) => ({ ...prev, to_mail: v }))}
                renderTags={(value, getTagProps) =>
                  data?.to_mail?.map((option, index) => (
                    <Chip variant="outlined" key={index} label={option} {...getTagProps({ index })} />
                  ))
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    InputProps={{ ...params.InputProps, disableUnderline: true }}
                    sx={{ width: '75vh' }}
                    type="email"
                    variant="standard"
                    placeholder=""
                  />
                )}
              />
            </Grid>
            <Grid item xs={1}>
              <Box>
                <Button
                  sx={{ padding: '6px 3px !important', minWidth: '25px !important' }}
                  onClick={() =>
                    setData((prev) => ({
                      ...prev,
                      isCc: !prev.isCc,
                    }))
                  }
                >
                  cc
                </Button>
                <Button
                  sx={{ padding: '6px 3px !important', minWidth: '25px !important' }}
                  onClick={() =>
                    setData((prev) => ({
                      ...prev,
                      isBcc: !prev.isBcc,
                    }))
                  }
                >
                  bcc
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Box>
        <Divider />
        {data.isCc && (
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
            <Typography>
              <span style={{ color: '#7C828D', paddingRight: '0.8rem' }}>cc: </span>
            </Typography>
            <TextField
              value={data.cc}
              onChange={(e) => handleChange(e.target.value, 'cc')}
              id="standard-basic"
              variant="standard"
              InputProps={{ disableUnderline: true }}
              sx={inputStyle}
            />
          </Box>
        )}
        <Divider />
        {data.isBcc && (
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
            <Typography>
              <span style={{ color: '#7C828D', paddingRight: '0.8rem' }}>bcc: </span>
            </Typography>
            <TextField
              value={data.bcc}
              onChange={(e) => handleChange(e.target.value, 'bcc')}
              id="standard-basic"
              variant="standard"
              InputProps={{ disableUnderline: true }}
              sx={inputStyle}
            />
          </Box>
        )}
        <Divider />
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', py: 1 }}>
          <Typography>
            <span style={{ paddingRight: '0.8rem', color: '#7C828D' }}>From: </span>
          </Typography>
          <Box sx={{ width: '85%', my: 1 }}>
            <Autocomplete
              options={options}
              getOptionLabel={(option) => option.value}
              id="controlled-demo"
              disableClearable
              value={options.find((option) => option.id === data.smtp_id) || null}
              onChange={onChangeHandler}
              renderInput={(params) => (
                <TextField
                  {...params}
                  InputProps={{ ...params.InputProps, disableUnderline: true }}
                  placeholder="Select your email"
                  variant="standard"
                />
              )}
            />
          </Box>
        </Box>
        <Divider />
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', py: 1 }}>
          <Typography>
            <span style={{ color: '#7C828D', paddingRight: '0.8rem' }}>Subject:</span> Fwd:
          </Typography>
          <TextField
            value={data.subject}
            onChange={(e) => handleChange(e.target.value, 'subject')}
            id="standard-basic"
            variant="standard"
            InputProps={{ disableUnderline: true }}
            sx={inputStyle}
          />
        </Box>
        <Box sx={{ height: { sm: '25vh', md: '29vh', lg: '33vh', xl: '45vh' } }}>
          <ReactQuill
            theme="snow"
            value={data.body}
            onChange={(e) => handleChange(e, 'body')}
            style={{ background: 'white' }}
            className="custom-quill"
          />
        </Box>
        <FormGroup sx={{ display: 'flex', mx: '2%', alignItems: 'center' }}>
          <FormControlLabel
            control={
              <Checkbox
                checked={data.follow_up_status}
                onClick={() =>
                  data.follow_up_status
                    ? setData((prev) => ({
                        ...prev,
                        follow_up_status: !prev.follow_up_status,
                        follow_up_days: 0,
                      }))
                    : setData((prev) => ({
                        ...prev,
                        follow_up_status: !prev.follow_up_status,
                      }))
                }
              />
            }
            label="If no reply "
          />
          <FormControl sx={{ my: 1, minWidth: 120 }}>
            <Select
              value={data.follow_up_days}
              onChange={(e) => handleChange(e.target.value, 'follow_up_days')}
              displayEmpty
              disabled={!data.follow_up_status}
            >
              <MenuItem value={0}>1 days</MenuItem>

              <MenuItem value={3}>3 days</MenuItem>
              <MenuItem value={5}>5 days</MenuItem>
              <MenuItem value={7}>1 week</MenuItem>
              <MenuItem value={14}>2 weeks</MenuItem>
              <MenuItem value={28}>4 weeks</MenuItem>
            </Select>
          </FormControl>
          <Typography sx={{ my: 1, mx: 1 }}>then remind me to follow-up</Typography>
        </FormGroup>
        <Box sx={{ textAlign: 'end' }}>
          <Button variant="contained" onClick={submit} disabled={isLoading.sendMail}>
            {isLoading.sendMail ? 'Loading...' : 'Send'}
          </Button>
          <Button variant="outlined" onClick={onClose} sx={{ mx: 2 }}>
            Cancel
          </Button>
        </Box>
      </Stack>
    </Box>
  );
};
export default Forward;
