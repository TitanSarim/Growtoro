import { Box, Button, Card, Modal, Stack } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { modalType } from '_mock/defines';
import Api from 'api/Api';
import Loading from 'components/Loading';
import ErrorHandling from 'utils/ErrorHandling';
import { AddButton } from 'components/button/buttons';
import DynamicInput from 'components/input/DynamicInput';
import SearchInput from 'components/input/SearchInput';
import BlockListModal from 'components/modal/BlockList/Index';
import ConfirmPopup from 'components/modal/campaign/ConfirmPopup';
import DeleteModal from 'components/modal/campaign/DeleteModal';
import UploadBlockListEmailDetails from 'components/modal/campaign/UploadBlockListEmailDetails';
import UploadCsv from 'components/modal/campaign/UploadCsv';
import ModalsHeader from 'components/modal/emails/ModalsHeader';
import { useNotification } from 'context/NotificationContext';
import { useUser } from 'context/UserContext';
import Papa from 'papaparse';
import { useCallback, useEffect, useState } from 'react';
import { FaArchive } from 'react-icons/fa';
import { PlainText } from 'utils/typography';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  maxWidth: 900,
  width: '100%',
  bgcolor: 'background.paper',
  boxShadow: 24,
  borderRadius: 2,
};
const innerStyle = {
  p: '20px 32px 28px',
};
export default function Blocklist() {
  const [csvData, setCsvData] = useState();
  const [csvHeaders, setCsvHeaders] = useState([]);
  const [columnIndex, setColumnIndex] = useState({});
  const { user } = useUser();
  const [check, setCheck] = useState(false);
  const { sendNotification } = useNotification();
  const [rowCount, setRowCount] = useState();


  console.log("csvHeaders46", csvHeaders)

  const handleLeadsCsvUpload = (csvFile) => {
    // setCsvData({});
    Papa.parse(csvFile, {
      header: false,
      skipEmptyLines: true,
      complete(results) {
        if (results.data.length > 1) {
          const extractedEmails = results?.data?.flatMap(row => row.filter(cell => /\S+@\S+\.\S+/.test(cell)));
          console.log("results.data", results.data)
          setCsvData(() => ({
            name: csvFile.name,
            size: csvFile.size,
            data: extractedEmails,
          }));
          setOpenModal(modalType.CampaignDetails);
        } else {
          sendNotification({
            open: true,
            message: 'Empty CSV file',
            alert: 'error',
          });
        }
      },
    });
  };
  const handleClose = () => {
    setDataEmail([]);
    setOpenModal('');
  };

 

  const handleSaveCsvEmailLeads = () => {
    handleLeadsSubmit(csvData.data);
  };


  const handleLeadsSubmit = async (leadsData) => {
    setIsLoading((prev) => ({ ...prev, handleLeadsSubmit: true }));

    try {
      // const _status = check ? 1 : 0;

      if (leadsData.length <= 0) {
        sendNotification({
          open: true,
          message: 'Select type properly',
          alert: 'error',
        });
      } else {
        Api.profile
          .createBlockList(user.tenant_id, { emails: leadsData })
          .then((res) =>{
          if(res?.data?.message === ' All emails are used by campaigns'){
            sendNotification({
              open: true,
              message: res?.data?.message,
              alert: 'error',
            });
          }else{
            sendNotification({
              open: true,
              message: res?.data?.message,
              alert: 'success',
            });
          }
          getBlockList()
        })
          .catch((err) =>{
            console.log("Error:", err);
             ErrorHandling({ err, sendNotification })
          })
        setOpenModal('');
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading((prev) => ({ ...prev, handleLeadsSubmit: false }));
    }
  };
  const columns = [
    { field: 'id', headerName: 'ID' },
    {
      field: 'email',
      headerName: 'Email',
      flex: 1,
      headerAlign: 'left',
      align: 'left',
      // format: (value) => value.toLocaleString('en-US'),
    },
  ];
  const [isLoading, setIsLoading] = useState([]);

  const [data, setData] = useState();
  const [dataEmail, setDataEmail] = useState(['']);
  // eslint-disable-next-line no-unused-vars
  const [search, setSearch] = useState(false);
  const rows = data?.map((row) => ({
    id: row.id,
    email: row.email,
  }));
  const [openModal, setOpenModal] = useState('');
  const [selectedRows, setSelectedRows] = useState([]);
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });

  console.log("dataEmail163",dataEmail)


  const getBlockList = useCallback(() => {
    setIsLoading((prev) => ({ ...prev, getBlockList: true }));
    Api.profile
      .getBlockList(user.tenant_id, paginationModel)
      .then((res) => {
        console.log("res137", res)
        setData(res.data.data);
        setRowCount(res?.data?.total_rows);
      })
      .catch((err) => ErrorHandling({ err, sendNotification }))
      .finally(() => {
        setIsLoading((prev) => ({ ...prev, getBlockList: false }));
      });
  }, [paginationModel, sendNotification, user.tenant_id]);

  useEffect(() => {
    getBlockList();
  }, [getBlockList]);

 
  const handleUpload = (e) => {
    e.preventDefault();
    const dataforvalidation = dataEmail
    const hasValidEmail = dataforvalidation.every((email) => {
      // Check if the email is not empty and contains "@" and "."
      return email.trim() !== "" && /\S+@\S+\.\S+/.test(email);
    });
   
    if (!hasValidEmail) {
      sendNotification({
        open: true,
        message: 'Please enter a valid email address',
        alert: 'error',
      });
    } else {
      handleLeadsSubmit(dataforvalidation);
    }
  };



  const handleUpdate = (index, value) => {
    setDataEmail((prev) => {
      const updatedData = [...prev];
      updatedData[index] = value;
      return updatedData;
    });
  };
  const handleDelete = () => {
    if (selectedRows.length > 0) setOpenModal(modalType.delete);
    else
      sendNotification({
        open: true,
        message: 'Select Email',
        alert: 'error',
      });
  };
  const handleEmailDelete = () => {
    Api.profile
      .deleteBlockList(user?.tenant_id, { id: selectedRows })
      .then(() => {
        sendNotification({
          open: true,
          message: 'Email deleted Successfully',
          alert: 'success',
        });
        const _emailList = data.filter((_email) => !selectedRows.includes(_email.id));
        setData(_emailList);
      })
      .catch((e) => {
        ErrorHandling({ e, sendNotification });
      });
  };
  const handleAddMoreRow = () => setDataEmail((prev) => [...prev, '']);

  const searchEmail = (e) => {
    if (e.length > 0) {
      setSearch(true);
      const matchedObjects = data.filter((obj) => obj.email.toLowerCase().includes(e.toLowerCase()));
      setData(matchedObjects);
    } else {
      setSearch(false);
    }
  };

  console.log("dataEmail", dataEmail);

  return (
    <>
      <Card

        sx={{
          width: '100%',
          height: { xs: '26vh', sm: '50vh', md: '62vh', lg: '75vh', xl: '76vh' },
          marginBottom: {md: '30px', lg: '60px', xl: '70px' }
        }}
      >
        <Stack direction="row" justifyContent="end" alignItems="center" mr={2}>
          <SearchInput placeholder="Search by email" onChange={searchEmail} />
          <AddButton text="Import" onClick={() => setOpenModal('blocklistModal')} />
          <Button
            disableElevation
            size="small"
            sx={{ color: '#333333', border: '2px solid #E9EBF0', ml: 1 }}
            onClick={handleDelete}
          >
            <FaArchive color="#FD71AF" size={20} style={{ marginRight: '8px' }} /> Delete
          </Button>
        </Stack>
        <Card
          sx={{
            width: '100%',
            height: { xs: '20vh', sm: '40vh', md: '52vh', lg: '59vh', xl: '70vh' },
          }}
        >
          {data ? (
            <DataGrid
              rows={rows}
              columns={columns}
              initialState={{
                pagination: {
                  paginationModel: {
                    pageSize: 10,
                  },
                },
              }}
              columnVisibilityModel={{
                id: false,
              }}
              onRowSelectionModelChange={(ids) => setSelectedRows(ids)}
              checkboxSelection
              disableRowSelectionOnClick
              pagination
              pageSizeOptions={[10, 25, 50, 100]}
              rowCount={rowCount}
              paginationMode="server"
              paginationModel={paginationModel}
              onPaginationModelChange={setPaginationModel}
            />
          ) : (
            <Box sx={{ width: '100%', height: '30vh', display: 'flex' }}>
              <Loading />
            </Box>
          )}
        </Card>
      </Card>
      <Modal open={openModal === 'blocklistModal'} onClose={() => setOpenModal('')}>
        <Box sx={style}>
          <Box
            sx={{
              padding: {
                xs: '2rem',
                md: '5rem',
              },
            }}
          >
            <BlockListModal setOpenModal={setOpenModal} />
          </Box>
        </Box>
      </Modal>
      <UploadCsv
        isOpen={openModal === modalType.SelectType}
        setOpenModal={setOpenModal}
        onSubmit={handleLeadsCsvUpload}
        onClose={() => setOpenModal('')}
      />


      {csvData && (
        <>
          <UploadBlockListEmailDetails
            isOpen={openModal === modalType.CampaignDetails}
            csvData={csvData}
            setCsvData={setCsvData}
            setOpenModal={setOpenModal}
            onSubmit={() => handleSaveCsvEmailLeads()}
            onClose={() => {
              setCsvHeaders([]);
              setCsvData(null);
              setOpenModal('');
            }}
            check={check}
            setCheck={setCheck}
            csvHeaders={csvHeaders}
            setCsvHeaders={setCsvHeaders}
          />
          <ConfirmPopup
            isOpen={openModal === modalType.ConfirmCampaign}
            name={'campaign'}
            loading={isLoading}
            data={csvData}
            onSubmit={handleSaveCsvEmailLeads}
            onClose={() => {
              setCsvData(null);
              setOpenModal('');
            }}
          />
        </>
      )}
      <Modal open={openModal === modalType.ManualEmails} onClose={handleClose}>
        <Box sx={style}>
          <ModalsHeader title="Insert Emails Manually" handleClose={() => setOpenModal('')} />
          <form onSubmit={handleUpload}>
            <Box sx={innerStyle}>
              <PlainText fontSize="16px" fontWeight="400" textAlign="start">
                You can enter up to 1,000 emails.
              </PlainText>

              <PlainText textAlign="start" fontSize="14px" fontWeight="700">
                Email
              </PlainText>

              {dataEmail.map((item, index) => (
                <Box key={index}>
                  <DynamicInput
                    type="email"
                    placeholder={'Email address'}
                    value={item}
                    updateData={(e) => handleUpdate(index, e.target.value)}
                  />
                </Box>
              ))}
            </Box>
            <Stack direction="column" justifyContent="center" alignItems="center" spacing={2}>
              <PlainText
                fontSize="14px"
                color="#00B783"
                margin="0px 10px"
                sx={{ cursor: 'pointer' }}
                onClick={handleAddMoreRow}
              >
                + ADD MORE ROWS
              </PlainText>
              <Stack direction="row" justifyContent="center" alignItems="center" spacing={2} py={3}>
                <Button
                  onClick={() => setOpenModal('')}
                  variant="text"
                  style={{
                    fontSize: '16px',
                    fontWeight: 400,
                    color: '#7B68EE',
                    borderRadius: '5px',
                    padding: '12px 50px',
                  }}
                >
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  fullWidth
                  sx={{
                    width: '100%',
                    color: '#FFFFFF',
                    fontSize: '16px',
                    fontWeight: 400,
                    mt: '8px',
                    backgroundColor: '#7B68EE',
                  }}
                  type="submit"
                  // onClick={handleUpload}
                  disabled={isLoading.handleLeadsSubmit}
                >
                  {isLoading.handleLeadsSubmit ? 'Loading...' : 'Upload'}
                </Button>
              </Stack>
            </Stack>
          </form>
        </Box>
      </Modal>
      <DeleteModal
        isOpen={openModal === modalType.delete}
        name={selectedRows.length > 1 ? 'these emails' : 'this email'}
        setOpenModal={setOpenModal}
        onClose={() => setOpenModal('')}
        onSubmit={handleEmailDelete}
      />
    </>
  );
}
