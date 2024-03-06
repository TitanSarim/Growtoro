import Papa from 'papaparse';
import { useNavigate } from 'react-router-dom';
import { useCallback, useEffect, useState } from 'react';
import { Box, Stack } from '@mui/system';
import { modalType } from '_mock/defines';
import { Button, Divider, Modal, Typography } from '@mui/material';
import { BsDownload } from 'react-icons/bs';
import { FaArchive } from 'react-icons/fa';
import ErrorHandling from 'utils/ErrorHandling';
import csvDownload from 'json-to-csv-export'

// import Layout from 'components/layout';

import Api from 'api/Api';
import Loading from 'components/Loading';
import { AddButton } from 'components/button/buttons';
import SearchInput from 'components/input/SearchInput';
import UploadCsv from 'components/modal/campaign/UploadCsv';
import ExportModal from 'components/modal/database/ExportModal';
import DeleteModal from 'components/modal/campaign/DeleteModal';
import ConfirmPopup from 'components/modal/campaign/ConfirmPopup';
import SaveContactsModal from 'components/modal/database/SaveContactsModal';
import NewCampainModals from 'components/modal/campaign/NewCampaignNameModal';
import UploadCampaignerDetails from 'components/modal/campaign/UploadCampaignerDetails';

import { useNotification } from 'context/NotificationContext';
import { useUser } from 'context/UserContext';
import { HeaderTitle } from 'utils/typography';
import { useCampaign } from 'context/CampaignContext';
import ListTable from './ListTable';

const Lists = () => {
  const { sendNotification } = useNotification();
  const { totalEmail, setTotalEmail, subscribersFromParseCsv, setSubscribersFromParseCsv } = useCampaign();
  const { user } = useUser();

  const [open, setOpen] = useState(false);
  const [exports, setExports] = useState(false);
  const [csvHeaders, setCsvHeaders] = useState([]);
  const [csvData, setCsvData] = useState({});
  const [columnIndex, setColumnIndex] = useState({});
  const [check, setCheck] = useState(false);
  const [listName, setListName] = useState();
  const [openModal, setOpenModal] = useState('');
  // const [isLoading, setIsLoading] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const [csvLink, setCsvLink] = useState([]);
  const [exportData, setExportData] = useState({})
  const [columnNames, setColumsNames] = useState([])
  const [exportCsvName, setExportCsvName] = useState('')
  const [tableData, setTableData] = useState([
    {
      name: '',
      lastModified: '',
      owner: '',
      records: '',
      id: '',
    },
  ]);

  const [loading, setLoading] = useState({
    listsPage: false,
    uploadCsv: false,
    parseCsv: false,
    confirmCsvUpload: false,
  });

  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });

  const [rowCount, setRowCount] = useState(0);

  const saveList = useCallback(() => {
    setLoading((prev) => ({ ...prev, listsPage: true }));
    Api.campaign
      .saveList(user?.tenant_id, paginationModel)
      .then((response) => {
        const newArray = response.data.data.map((item) => ({
          id: item.id,
          name: item.name,
          type: item.type,
          records: item.emails,
          owner: user?.user.name,
          lastModified: item.last_modified,
          emails: item.emails,
          subscribers_data: item.subscribers_data
        }));
        setTableData(newArray);
        setRowCount(response.data.total_rows);
      })
      .catch((e) => {
        console.log(e.message);
      })
      .finally(() => {
        setLoading((prev) => ({ ...prev, listsPage: false }));
      });
  }, [paginationModel, user?.tenant_id, user?.user.name]);

  useEffect(() => {
    saveList();
  }, [saveList]);

  async function csvFileWithKey() {

    const uniqueHeaders = [...new Set(csvHeaders)];
    const updatedCsvHeaders = uniqueHeaders.filter(item => item !== "do_not_import");
    setCsvHeaders(updatedCsvHeaders)

    const mapHeadersToRows = (headers, rows) => {
      return rows.map(row => {
        const mappedObject = {};
        headers.forEach((header, index) => {
          mappedObject[header] = row[index];
        });
        return mappedObject;
      });
    };

    const rows = Object.values(csvData?.data).slice(1);
    const mappedRows = mapHeadersToRows(updatedCsvHeaders, rows);
    setSubscribersFromParseCsv(mappedRows);

    return new Promise((resolve, reject) => {
      Api.campaign
        .csvFileWithKey(user?.tenant_id, {
          header: updatedCsvHeaders,
          subscribers: mappedRows,
        })
        .then((response) => {
          resolve(response);
        })
        .catch((e) => {
          reject(e);
        });
    });
  }

  const handleOpen = () => {
    setOpen(!open);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleDelete = () => {
    if (selectedRows.length > 0) {
      setOpenModal('delete');
    } else
      sendNotification({
        open: true,
        message: 'Select List',
        alert: 'error',
      });
  };


  const handleListDelete = () => {
    Api.emailList
      .deleteEmailList(user?.tenant_id, { id: selectedRows })
      .then((res) => {
        sendNotification({
          open: true,
          message: 'List deleted Successfully',
          alert: 'success',
        });
        if (res.status === 200) {
          const _data = tableData.filter((_tableData) => !selectedRows.includes(_tableData.id));
          saveList();
          setTableData(_data);
          setSelectedRows([]);
        }
      })
      .catch((e) => {
        ErrorHandling({ e, sendNotification });
      });

    // Api.emailList.getEmailList(user?.tenant_id, paginationModel).then((res) => {
    //   const newArray = res.data.data.map((item) => ({
    //     id: item.id,
    //     name: item.name,
    //     records: item.emails.length,
    //     owner: user?.user.name,
    //     lastModified: item.last_modified,
    //     emails: item.emails,
    //   }));
    //   setTableData(newArray);
    //   setRowCount(res.data.total_rows);
    // });
  };

  const handleExportsClose = () => {
    setExports(false);
    setCsvLink([]);
  };

  const handleExportsOpen = () => {
    setExports(true);

    const flattenedData = exportData.reduce((acc, row) => acc.concat(row), []);
    const dataToConvert = {
      data: flattenedData,
      filename: exportCsvName,
      delimiter: ',',
      headers: columnNames
    }
    csvDownload(dataToConvert)

    sendNotification({
      open: true,
      message: 'CSV Exported',
      alert: 'warning',
    });
    setExports(false);
    setCsvLink([]);
  };

  // NewCampainModals submit handling
  const handleNewCampaignInit = (value) => {
    setListName(value);
    setOpenModal(modalType.SelectType);
  };


  const handleExports = () => {
    const matchedRows = tableData.filter(row => selectedRows.includes(row.id));
    console.log("matchedRows", matchedRows);

    if (matchedRows.length === 0) {
      console.warn('No matching rows found for export');
      return;
    }

    const subscribersDataForSelectedRows = matchedRows.map(row => row.subscribers_data);

    console.log("subscribersDataForSelectedRows", subscribersDataForSelectedRows)

    const columnNames = Array.from(new Set(subscribersDataForSelectedRows.flatMap(subscriberArray => 
      subscriberArray.flatMap(subscriber => Object.keys(subscriber))
    )));

    setColumsNames(columnNames)
    setExportData(subscribersDataForSelectedRows)
    setExportCsvName(matchedRows[0].name)
  };



  // UploadCsv submit handling
  const handleLeadsCsvUpload = async (csvFile) => {
    if (csvFile.type !== 'text/csv') {
      sendNotification({
        open: true,
        message: 'Please upload CSV file only',
        alert: 'error',
      });
      return;
    }

    const isCsvEmpty = await isCSVEmpty(csvFile);
    if (isCsvEmpty) {
      sendNotification({
        open: true,
        message: 'Empty CSV file',
        alert: 'error',
      });
      return;
    }

    setLoading((prev) => ({ ...prev, uploadCsv: true }));

    Api.campaign
      .parseCsv(user?.tenant_id, {
        csv_file: csvFile,
      })
      .then((response) => {
        const data = response?.data;

        const headers = data?.headers;
        const standardHeaders = ["first_name", "last_name", "email", "job_title", "state", "country", "city", "company", "custom",];
        const createStaticRow = (standardHeaders) => {
          const staticRow = standardHeaders.reduce((acc, header) => {
            const key = header?.replace('_', ' ').replace(/\b\w/g, c => c.toUpperCase());
            return { ...acc, [header]: key };
          }, {});
        
          return staticRow;
        };
        const staticRow = createStaticRow(standardHeaders);
        const matchHeaders = (headers, standardHeaders) => {
          return headers?.map(header => {
            if (/@.*\..*/.test(header)) {
              return 'email';
            }
            const standardHeader = standardHeaders.find(standard => standard.toLowerCase() === header.toLowerCase() || standard.toLowerCase() === header?.replace(/\s+/g, '_').toLowerCase());
            return standardHeader && standardHeader !== "do_not_import"
            ? standardHeader
            : 'custom';
          })
        };
        const matchedHeaders = matchHeaders(headers, standardHeaders);
        const newSetCsvHeaders = [...new Set(matchedHeaders.filter(header => header !== 'do_not_import'))];
        setCsvHeaders(newSetCsvHeaders)
        console.log("newSetCsvHeaders", newSetCsvHeaders)

        setSubscribersFromParseCsv(data?.subscribers);

        // if (Object.keys(response?.data?.subscribers)?.length > 1000) {
        //   sendNotification({
        //     open: true,
        //     message: 'Maximum 1000 emails allowed',
        //     alert: 'error',
        //   });
        //   return;
        // }

        setCsvData(() => ({
          name: csvFile.name,
          size: csvFile.size,
          data: [[...data.headers], ...Object.values(data.subscribers)],
        }));
        setOpenModal(modalType.CampaignDetails);
      })
      .finally(() => {
        setLoading((prev) => ({ ...prev, uploadCsv: false }));
      });
  };

  // handle UploadCampaignerDetails submit
  const handleUploadCampaignerDetails = async () => {
    setLoading((prev) => ({ ...prev, parseCsv: true }));

    try {
      if (csvHeaders.length === 0) {
        sendNotification({
          open: true,
          message: 'Please select at least one',
          alert: 'error',
        });
        setLoading((prev) => ({ ...prev, parseCsv: false }));

        return;
      }

      if (csvHeaders?.includes("custom")) {
        sendNotification({
          open: true,
          message: 'Please assign name to custom',
          alert: 'error',
        });
        // setLoading((prev) => ({ ...prev, handleUploadCampaignerDetails: false }));
  
        return;
      }

      if (csvHeaders?.includes(undefined)) {
        sendNotification({
          open: true,
          message: 'Fields cannot be empty',
          alert: 'error',
        });
       setLoading((prev) => ({ ...prev, handleUploadCampaignerDetails: false }));
  
        return;
      }
  

      const duplicates = findDuplicatesExcludingOptions(csvHeaders, ['custom', 'do_not_import']);

      // check if duplicate fields exist in csvHeaders
      // if (duplicates.length !== 0) {
      //   sendNotification({
      //     open: true,
      //     message: 'Duplicate fields',
      //     alert: 'error',
      //   });
      //   setLoading((prev) => ({ ...prev, parseCsv: false }));

      //   return;
      // }

      // check if email field is present in all items
      const csvFileEmailLeads = csvData.data.map((item) => {
        const keys = Object.keys(columnIndex);
        let lead = {};

        keys.forEach((keyItem, index) => {
          lead = { ...lead, [keyItem]: item[index] };
        });

        return lead;
      });
      csvFileEmailLeads.shift();

      const getCsvFileWithKeyArray = await csvFileWithKey(csvFileEmailLeads);

      // const isEmailExistInAllFields = hasValidEmails(getCsvFileWithKeyArray?.data?.subscribersList);

      // if (!isEmailExistInAllFields) {
      //   sendNotification({
      //     open: true,
      //     message: 'Email field is not present in all items',
      //     alert: 'error',
      //   });
      //   setLoading((prev) => ({ ...prev, parseCsv: false }));

      //   return;
      // }
      // end - check if email field is present in all items
      // console.log('clicked🔥');
      setSubscribersFromParseCsv(getCsvFileWithKeyArray?.data?.subscribersList);

      setOpenModal(modalType.ConfirmCampaign);
      csvHeaders.forEach((value, index) => {
        setColumnIndex((prev) => ({ ...prev, [value]: index }));
      });
      setCsvHeaders([]);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading((prev) => ({ ...prev, parseCsv: false }));
      setLoading((prev) => ({ ...prev, uploadCsv: false }));
    }
  };

  const handleSaveCsvEmailLeads = async () => {
    setLoading((prev) => ({ ...prev, confirmCsvUpload: true }));

    const csvFileEmailLeads = csvData.data.map((item) => {
      const keys = Object.keys(columnIndex);
      let lead = {};

      keys.forEach((keyItem, index) => {
        lead = { ...lead, [keyItem]: item[index] };
      });

      return lead;
    });

    csvFileEmailLeads.shift();
    handleLeadsSubmit(csvFileEmailLeads);
  };

  const handleLeadsSubmit = async (leadsData) => {
    try {
      const _status = check ? 1 : 0;

      const newData = {
        status: _status,
        list_name: listName,
        leadsData: subscribersFromParseCsv,
      };

      if (leadsData.length <= 0) {
        sendNotification({
          open: true,
          message: 'Please select at least one',
          alert: 'error',
        });

        return;
      }

      await createEmailSubscriber(newData);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading((prev) => ({ ...prev, confirmCsvUpload: false }));
    }
  };

  const createEmailSubscriber = async (data) => {
    const res = await Api.emailSubscriber
      .createEmailSubscriber(user?.tenant_id, data)
      .then((res) => {
        if (res.data.permission === 0) {
          setOpenModal('Permission');
          setTotalEmail(res?.data?.email_limit);
          return;
        }

        setOpenModal('');
        sendNotification({
          open: true,
          message: res.data.message,
          alert: 'success',
        });
        saveList();
      })
      .catch((e) => {
        sendNotification({
          open: true,
          message: e.message,
          alert: 'error',
        });
      });

    return res;
  };

  const handleSearch = (value) => {
    if (value === '') {
      Api.campaign
        .saveList(user?.tenant_id, paginationModel)
        .then((response) => {
          const newArray = response.data.data.map((item) => ({
            id: item.id,
            name: item.name,
            records: item.emails.length,
            owner: user?.user.name,
            lastModified: item.last_modified,
            emails: item.emails,
          }));
          setTableData(newArray);
          setRowCount(response.data.total_rows);
        })
        .catch((e) => {
          console.log(e.message);
        });
      return;
    }

    Api.campaign
      .getEmailListByEmail(user?.tenant_id, { ...paginationModel, q: value })
      .then((response) => {
        const newArray = response.data.data.map((item) => ({
          id: item.id,
          name: item.name,
          records: item.emails.length,
          owner: user?.user.name,
          lastModified: item.last_modified,
          emails: item.emails,
        }));
        setTableData(newArray);
        setRowCount(response.data.total_rows);
      })
      .catch((e) => {
        console.log(e.message);
      })
      .finally(() => {});
  };

  const readFileAsync = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = (e) => {
        resolve(e.target.result);
      };

      reader.onerror = (e) => {
        reject(e);
      };

      reader.readAsText(file);
    });

  const isCSVEmpty = async (fileData) => {
    // Read the CSV file
    // const fileData = fs.readFileSync(filePath, 'utf8');

    // Use PapaParse to parse the CSV data
    // const d = await Papa.parse(fileData);

    const readableData = await readFileAsync(fileData);
    const parsedData = Papa.parse(readableData, { header: false, skipEmptyLines: true });

    return parsedData.data.length === 0;

    // Check if the data array is empty
    // return data.length === 0;
  };

  if (loading.listsPage) {
    return (
      <Box sx={{ width: '100%', height: '150%', display: 'flex' }}>
        <Loading />
      </Box>
    );
  }

  return (
    <>
      <HeaderTitle mb={1}>Lists</HeaderTitle>

      {/* <Box sx={{ width: '100%', height: '150%', display: 'flex' }}>
        <Loading />
      </Box> */}

      {/* export/delete/search/import */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', height: 35, mb: '1vh' }}>
        <Box sx={{ display: 'flex', gap: 1.5 }}>
          {/* <SequenceDropdown
                label="Sequence"
                leftIcon={<SendIcon sx={{ color: '#4896FF', mr: 1, fontSize: 25 }} />}
              /> */}
          <Button
            size="medium"
            sx={{
              color: '#333333',
              border: '2px solid #E9EBF0',
              minWidth: '6rem !important',
            }}
            disableRipple
            disableFocusRipple
            onClick={() => {
              if (selectedRows.length > 0) {
                setExports(true);
                handleExports()
              } else
                sendNotification({
                  open: true,
                  message: 'Select List',
                  alert: 'error',
                });
            }}
          >
            <BsDownload color="#FFBC01" size={20} style={{ marginRight: '8px' }} />
            <Typography variant="body2" fontWeight="bold">
              Export
            </Typography>
          </Button>
          <Button
            disableElevation
            size="small"
            sx={{ color: '#333333', border: '2px solid #E9EBF0' }}
            onClick={handleDelete}
          >
            <FaArchive color="#FD71AF" size={20} style={{ marginRight: '8px' }} /> Delete
          </Button>
        </Box>
        <Box sx={{ display: 'flex', gap: '0.5rem' }}>
          <SearchInput sx={{ py: '0rem !important', pr: '0rem !important' }} onChange={handleSearch} />
          <AddButton
            onClick={() => setOpenModal('name')}
            text="IMPORT"
            sx={{ minWidth: '7rem !important', py: '0rem !important' }}
          />
        </Box>
      </Box>

      <ListTable
        tableData={tableData}
        setTableData={setTableData}
        selectedRows={selectedRows}
        setSelectedRows={setSelectedRows}
        paginationModel={paginationModel}
        setPaginationModel={setPaginationModel}
        rowCount={rowCount}
      />

      <NewCampainModals
        title="Let's create a new list"
        placeholder="List Name"
        isOpen={openModal === 'name'}
        onSubmit={handleNewCampaignInit}
        onClose={() => setOpenModal('')}
      />

      <UploadCsv
        isOpen={openModal === modalType.SelectType}
        setOpenModal={setOpenModal}
        loading={loading.uploadCsv}
        onSubmit={handleLeadsCsvUpload}
        onClose={() => setOpenModal('')}
      />

      {csvData && (
        <>
          <UploadCampaignerDetails
            isOpen={openModal === modalType.CampaignDetails}
            csvData={csvData}
            setCsvData={setCsvData}
            loading={loading.parseCsv}
            setOpenModal={setOpenModal}
            onSubmit={handleUploadCampaignerDetails}
            onClose={() => {
              setCsvData(null);
              setOpenModal('');
              setLoading((prev) => ({ ...prev, uploadCsv: false }));
              setLoading((prev) => ({ ...prev, parseCsv: false }));
            }}
            check={check}
            setCheck={setCheck}
            csvHeaders={csvHeaders}
            setCsvHeaders={setCsvHeaders}
          />

          <ConfirmPopup
            isOpen={openModal === modalType.ConfirmCampaign}
            name={'storage'}
            loading={loading.confirmCsvUpload}
            data={csvData}
            onSubmit={() => {
              setLoading((prev) => ({ ...prev, handleLeadsSubmit: true }));
              handleSaveCsvEmailLeads();
            }}
            onClose={() => {
              setCsvData({});
              setOpenModal('');
            }}
          />
        </>
      )}

      <DeleteModal
        isOpen={openModal === 'delete'}
        name={selectedRows.length > 1 ? 'these lists' : 'this list'}
        setOpenModal={setOpenModal}
        onClose={() => setOpenModal('')}
        onSubmit={handleListDelete}
      />

      <AddEmailPermission
        isOpen={openModal === 'Permission'}
        onClose={() => {
          setOpenModal(modalType.Close);
        }}
        onSubmit={() => {}}
        emailNumber={totalEmail}
      />

      <SaveContactsModal data={{ open, setOpen, handleOpen, handleClose }} />
      {exports && <ExportModal data={{ csvLink, exports, setExports, handleExportsOpen, handleExportsClose }} />}
    </>
  );
};

export default Lists;

const emailPermissionStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  maxWidth: 560,
  width: '100%',
  bgcolor: 'background.paper',
  boxShadow: 24,
  borderRadius: 2,
  padding: '20px 35px',
};

function AddEmailPermission({ isOpen, onClose, emailNumber }) {
  const navigate = useNavigate();

  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={emailPermissionStyle}>
        <Stack direction="row" justifyContent="center">
          <Typography id="modal-modal-title" variant="h4" component="h2">
            Plan limit reached
          </Typography>
        </Stack>
        <Divider sx={{ mt: 2, mb: 1 }} />

        <Stack direction="column" justifyContent="center">
          <Typography
            variant="body1"
            sx={{
              fontFamily: 'Inter',
              fontStyle: 'normal',
              fontWeight: 400,
              fontSize: '16px',
              // padding: '22px 0px',
            }}
          >
            Your current plan only allows up to {emailNumber} contacts.
            <br />
            <br />
            Please consider upgrading your plan to upload more contacts.
          </Typography>
        </Stack>
        <Stack direction="row" justifyContent="center" alignItems="center" spacing={1} mt={4}>
          <Button
            type="submit"
            variant="contained"
            style={{ textTransform: 'uppercase', fontSize: '16px' }}
            onClick={() => navigate('/profile?tab=3')}
          >
            Upgrade plan
          </Button>

          <Button variant="text" sx={{ fontSize: '18px' }} onClick={onClose}>
            Cancel
          </Button>
        </Stack>
      </Box>
    </Modal>
  );
}

function findDuplicatesExcludingOptions(options, excludedOptions) {
  const exemptSet = new Set(excludedOptions);
  const seenSet = new Set();
  const duplicates = [];

  // eslint-disable-next-line no-restricted-syntax
  for (const option of options) {
    if (!exemptSet.has(option)) {
      if (seenSet.has(option)) {
        duplicates.push(option);
      } else {
        seenSet.add(option);
      }
    }
  }

  return duplicates;
}

function hasValidEmails(data) {

  if (!Array.isArray(data)) {
    return false;
  }

  const emailChecks = data.map((item) => (
    item &&
    typeof item === 'object' &&
    Object.values(item).some((value) => typeof value === 'string' && value.includes('@'))
  ));

  return emailChecks.every(Boolean);
}