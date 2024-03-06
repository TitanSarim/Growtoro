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

const UploadCampaignerDetails = ({
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

  const handleCheckbox = () => {
    setCheck(!check);
  };

  useEffect(() => {
    setCheck(true);

    const newSetCsvHeaders = [...new Set(csvHeaders.filter((header) => header !== 'do_not_import'))]
    setCsvHeaders(newSetCsvHeaders);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  console.log("csvData",csvData)

  return (
    <Modal open={isOpen} onClose={onClose}>
      <Box sx={style}>
        <ModalsHeader title="Upload File" subHeader="Supported file formats: CSV" handleClose={onClose} />

        <ActionAlerts data={csvData} setCsvData={setCsvData} />

        <Box sx={innerStyle}>
          <Grid
            container
            columnSpacing={6}
            sx={{
              pb: '1rem',
              borderBottom: '1px solid rgba(185, 190, 199, 0.6);',
            }}
          >
            <Grid item xs={3}>
              <PlainText textAlign="start" fontSize="14px" fontWeight="700">
                Column Name
              </PlainText>
            </Grid>
            <Grid item xs={5}>
              <PlainText textAlign="start" fontSize="14px" fontWeight="700">
                Select Type
              </PlainText>
            </Grid>
            <Grid item xs={4}>
              <PlainText textAlign="start" fontSize="14px" fontWeight="700">
                Samples
              </PlainText>
            </Grid>
          </Grid>

          <Details
            name={csvData?.data && csvData?.data[0]}
            samples1={csvData?.data && csvData?.data[1]}
            samples2={csvData?.data && csvData?.data[2] ? csvData?.data[2] : ''}
            csvHeaders={csvHeaders}
            setCsvHeaders={setCsvHeaders}
          />
        </Box>
        <Stack direction="column" justifyContent="center" alignItems="center" spacing={2} style={{ padding: '1rem' }}>
          <Stack direction="row" justifyContent="center" alignItems="center">
            <Checkbox checked={check} onClick={handleCheckbox} />
            <PlainText variant="body2" color="#333333">
              Check for duplicates across all campaigns
            </PlainText>
          </Stack>
          <Stack direction="row" justifyContent="center" alignItems="center">
            <img src={`/assets/icons/ic_row.svg`} alt="" height="17px" width="17px" />
            <PlainText variant="body2" color="#00B783" margin="0px 10px">
              Detected {csvData?.data?.length - 1} data rows
            </PlainText>
          </Stack>
          <StyledButton
            id="campaign-upload-all"
            sx={{
              background: loading ? '#E5E8EB!important' : '#7B68EE!important',
            }}
            onClick={() => {
              // restrict to upload if more than 1000 rows
              if (csvData?.data?.length > 5000) {
                sendNotification({
                  open: true,
                  message: '5000 contact highest limit',
                  alert: 'error',
                });
                return;
              }
              if(csvHeaders.includes("custom")){
                sendNotification({
                  open: true,
                  message: 'Please assign value to custom',
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

export default UploadCampaignerDetails;

const Details = ({ name, samples1, samples2, csvHeaders, setCsvHeaders }) => {

  console.log("matchingData1", csvHeaders)


  const { typeData, setTypeData } = useCampaign();
  const { sendNotification } = useNotification();

  const [customSelectFieldIndex, setCustomSelectFieldIndex] = useState(null);
  const [openModal, setOpenModal] = useState('');
  const [custom, setCustom] = useState('');


  const handleAddCustom = (values) => {
    const notAllowedItems = typeData[0].type.map((item) => item.name);

    if (csvHeaders.includes(values)) {
      sendNotification({
        open: true,
        message: 'This field already exists',
        alert: 'error',
      });
      return;
    }

    if (notAllowedItems.includes(values)) {
      sendNotification({
        open: true,
        message: `Field "${values}" is reserved. Please choose another name.`,
        alert: 'error',
      });
      return;
    }

    setTypeData((prevDatas) => {
      const newData = [...prevDatas];
      console.log("newData", newData, values)
      newData[0].type.push({
        name: values,
        image: <MdDashboardCustomize size={20} style={{ marginRight: '10px', color: 'blue' }} />,
        value: values,
      });
      return newData;
    });

    const newArr = [...csvHeaders];
    newArr[customSelectFieldIndex] = values;
    setCsvHeaders(newArr);
    setOpenModal('');

    setCustom('');
  };

  const onChangeHandler = (value, index) => {
    if (value === 'custom') {
      setCustomSelectFieldIndex(index);
      setOpenModal(modalType.CustomType);
    } else {
      const newArr = [...csvHeaders];
      newArr[index] = value;

      setCsvHeaders(newArr);
    }
  };

  const filteredTypeData = typeData[0].type.filter((data) => data.value !== 'sending_account_full_name');
  console.log("filteredTypeData", filteredTypeData);
  console.log("name", typeData);

useEffect(() => {
  const newData = name.map((nameItem, index) => {
    const matchingData = filteredTypeData.find(data => data.value === nameItem);
    return matchingData?.value || 'do_not_import';
  });

  setCsvHeaders((prevDatas) => [...prevDatas, ...newData]);
}, []);



  return (
    <>
      <Grid
        container
        columnSpacing={6}
        sx={{
          py: '1rem',
          borderBottom: '1px solid rgba(185, 190, 199, 0.6);',
          direction: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {name.map((n, index) => (
          <Fragment key={index}>
            <Grid item xs={3} key={index}>
              <PlainText textAlign="start" fontSize="16px" marginBottom={2}>
                {n}
              </PlainText>
            </Grid>
            <Grid item xs={5} sx={{ mb: 2 }}>
              <DynamicDropdown2
                index={index}
                name={n}
                defaultValue={csvHeaders[index] || 'do_not_import'}
                onChangeHandler={onChangeHandler}
                selectItems={filteredTypeData}
              />
            </Grid>
            <Grid
              item
              xs={4}
              sx={{
                pl: '2rem',
                mb: 2,
              }}
            >
              <PlainText textAlign="start" fontSize="16px">
                {samples1[index]}
              </PlainText>
              {samples2 ? (
                <PlainText textAlign="start" fontSize="16px">
                  {samples2[index]}
                </PlainText>
              ) : (
                ''
              )}
            </Grid>
            <Divider style={{ backgroundColor: '#6605B8' }} />
          </Fragment>
        ))}
        <Divider style={{ backgroundColor: '#6605B8' }} />
      </Grid>

      <CustomValue
        isOpen={openModal === modalType.CustomType}
        setOpenModal={setOpenModal}
        onSubmit={handleAddCustom}
        onClose={() => {
          setCustomSelectFieldIndex(null);
          setOpenModal('');
        }}
        custom={custom}
        setCustom={setCustom}
      />
    </>
  );
};

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

function DynamicDropdown2({ index, name, defaultValue, onChangeHandler, selectItems = [] }) {

  console.log("name23", defaultValue)

  return (
    <FormControl sx={{ width: '100%' }}>
      <Select
        className={`select-type-${index}`}
        // onChange={onChangeHandler}
        sx={{
          backgroundColor: 'white',
          padding: '5px',
          border: '1px solid #B9BEC7',
          borderRadius: '5px',
        }}
        name={name}
        value={defaultValue}
      >
        {selectItems?.map((item, selectIndex) => (
          <MenuItem
            key={selectIndex}
            value={item?.value ?? item?.name}
            className={`select-item-${selectIndex}`}
            onClick={() => {
              onChangeHandler(item.value, index);
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center' }}>
              {/* <div style={{ display: 'flex', alignItems: 'center' }}> */}

              {item.image}

              {/* </div>  */}
              <div>{item?.name || item?.value}</div>
            </div>
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
