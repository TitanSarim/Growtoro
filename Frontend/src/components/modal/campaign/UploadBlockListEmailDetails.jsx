import { Fragment, useEffect, useState } from 'react';
import {
  Box,
  Checkbox,
  Divider,
  FormControl,
  Grid,
  LinearProgress,
  MenuItem,
  Modal,
  Select,
  TextField,
  Stack,
  Typography,
} from '@mui/material';
import { MdDashboardCustomize } from 'react-icons/md';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';

// import DynamicDropdown2 from 'components/input/DynamicDropdown2';
import LoadingButton from '@mui/lab/LoadingButton';
import { modalType } from '_mock/defines';
import { useCampaign } from 'context/CampaignContext';
import { useNotification } from 'context/NotificationContext';
import { StyledButton } from '../../button/buttonStyles';
import { PlainText } from '../../../utils/typography';
import ModalsHeader from '../emails/ModalsHeader';
import CustomValue from './CustomValue';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '100%',
  maxWidth: 900,
  bgcolor: 'background.paper',
  boxShadow: 24,
  borderRadius: 2,
  pb: 2,
  height: '90%',
  overflow: 'hidden',
  overflowY: 'scroll',
};

const innerStyle = {
  p: '20px 32px',
};

const UploadBlockListEmailDetails = ({
  isOpen,
  csvData,
  setCsvData,
  onSubmit,
  onClose,
  check,
  setCheck,
  csvHeaders,
  setCsvHeaders,
  loading,
}) => {


  console.log("setehaders1", csvHeaders);

  const { sendNotification } = useNotification();

  console.log("csvData",csvData)

  return (
    <Modal open={isOpen} onClose={onClose}>
      <Box sx={style}>
        <ModalsHeader title="Upload File" subHeader="Supported file formats: CSV" handleClose={onClose} />

        <ActionAlerts data={csvData} setCsvData={setCsvData} />

        <Stack direction="column" justifyContent="center" alignItems="center" spacing={2} style={{ padding: '1rem' }}>
          
          <Box>
            {/* <Typography variant='h6' sx={{ mb: 4 }}>Email List</Typography> */}
            {csvData?.data?.slice(0, 7).map((item, i) =>(
              <div key={i} style={{ marginBottom: '10px' }}>
                <TextField fullWidth defaultValue={item} disabled style={{ marginBottom: '10px' }} />
              </div>
            ))}
          </Box>

          <Stack direction="row" justifyContent="center" alignItems="center">
            <img src={`/assets/icons/ic_row.svg`} alt="" height="17px" width="17px" />
            <PlainText variant="body2" color="#00B783" margin="0px 10px">
              Detected {csvData?.data?.length} Emails
            </PlainText>
          </Stack>
          <StyledButton
            id="campaign-upload-all"
            sx={{
              background: loading ? '#E5E8EB!important' : '#7B68EE!important',
            }}
            onClick={() => {
              // restrict to upload if more than 5000 rows
              if (csvData?.data?.length > 5000) {
                sendNotification({
                  open: true,
                  message: '5000 contact highest limit',
                  alert: 'error',
                });
                return;
              }
              
              onSubmit();
            }}
            padding="50px 50px"
          >
            {/* <LoadingButton
              loading={false}
              variant="contained"
              color="primary"
              style={{
                fontSize: '1em',
                fontWeight: 400,
                color: '#fff',
                borderRadius: '5px',
                padding: '2em 2em',
              }}
            >
              Upload
            </LoadingButton> */}

            <Typography variant="h5">{loading ? 'Loading...' : 'Upload All'}</Typography>
          </StyledButton>
        </Stack>
      </Box>
    </Modal>
  );
};

export default UploadBlockListEmailDetails;



function ActionAlerts({ data, setCsvData }) {
  const [show, setShow] = useState(true);
  return (
    <div>
      {show && (
        <Box sx={{ padding: '25px 32px' }}>
          <Stack
            sx={{ width: '100%', border: '1px dashed rgba(185, 190, 199, 0.6)', padding: '1rem', borderRadius: '5px' }}
            spacing={2}
          >
            <HighlightOffIcon
              sx={{ cursor: 'pointer', marginLeft: 'auto' }}
              onClick={() => {
                setShow(!show);
                setCsvData('');
              }}
            />
            <PlainText fontSize="14px" fontWeight="400">
              {data.size}
            </PlainText>
            <PlainText fontSize="16px" fontWeight="700">
              {data.name}
            </PlainText>
            <LinearProgress variant="determinate" value={100} />
          </Stack>
          <Stack direction="row" justifyContent="center" alignItems="center" mt={2}>
            <img src={`/assets/icons/ic_row.svg`} alt="" height="17px" width="17px" />
            <PlainText fontSize="14px" color="#00B783" margin="0px 10px">
              File processed
            </PlainText>
          </Stack>
        </Box>
      )}
    </div>
  );
}

