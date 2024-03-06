import Papa from 'papaparse';
import TuneIcon from '@mui/icons-material/Tune';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { BsDownload } from 'react-icons/bs';

import { modalType } from '_mock/defines';
import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Box, Button, Checkbox, MenuItem, Modal, Stack, Typography } from '@mui/material';

import Api from 'api/Api';
import ErrorHandling from 'utils/ErrorHandling';
import LeadUpload from 'components/LeadUpload';
import Loading from 'components/Loading';
import CheckAll from 'components/filter/CheckAll';
import SearchInput from 'components/input/SearchInput';
import ConfirmPopup from 'components/modal/campaign/ConfirmPopup';
import DeleteModal from 'components/modal/campaign/DeleteModal';
import ManualEmails from 'components/modal/campaign/ManualEmails';
import SaveList from 'components/modal/campaign/SaveList';
import UploadCsvModal from 'components/modal/campaign/UploadCsv';
import EmailLeadsTable from 'components/tables/EmailLeadsTable';
import AddEmailPermission from 'components/modal/emails/AddEmailPermission';
import UploadCampaignerDetails from 'components/modal/campaign/UploadCampaignerDetails';
// import {  } from 'react-router-dom';

import { useCampaign } from 'context/CampaignContext';
// import { AddButton } from 'components/button/buttons';
import { useNotification } from 'context/NotificationContext';
import { useUser } from 'context/UserContext';
import { StyledMenu } from 'pages/EmailAccounts/Index';
import { FaArchive } from 'react-icons/fa';
import csvDownload from 'json-to-csv-export'


export const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  maxWidth: 900,
  width: '100%',
  bgcolor: 'background.paper',
  boxShadow: 24,
  borderRadius: 2,
  pb: 2,
};

const Contacts = () => {
  const navigate = useNavigate();

  const { user } = useUser();
  const { sendNotification } = useNotification();
  const {
    newCampaign,
    setNewCampaign,
    totalEmail,
    setTotalEmail,
    setNewCampaignTab,
    isLoading,
    onNewCampaignInputChange,
    subscribersFromParseCsv,
    setSubscribersFromParseCsv,
  } = useCampaign();

  const [loading, setLoading] = useState({
    uploadCsv: false,
    // handleLeadsSubmit: false,
    handleUploadCampaignerDetails: false,

    saveListSubmit: false,
    manualEmailsSubmit: false,
  });


  const [csvData, setCsvData] = useState({});
  // eslint-disable-next-line no-unused-vars
  const [search, setSearch] = useState(false);
  const [_csvHeaders, setCsvHeaders] = useState([]);
  const csvHeaders = Array.from(new Set(_csvHeaders));
  const [columnIndex, setColumnIndex] = useState({});
  const [check, setCheck] = useState(false);
  const [openModal, setOpenModal] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);
  const [options, setOptions] = useState([false, false, false]);
  const [locationPath, setLocationPath] = useState("")

  const [emailList, setEmailList] = useState(newCampaign?.email_subscribers ?? []);
  const [selectedRows, setSelectedRows] = useState([]);
  // const [storedData, setStoredData] = (localStorage.getItem("csvData"))


  const searchConatcts = (e) => {
    if (e?.length > 0) {
      setSearch(true);
      const matchedObjects = emailList.filter((obj) => obj.email.toLowerCase().includes(e.toLowerCase()));
      setEmailList(matchedObjects);
    } else {
      setSearch(false);
    }
  };

  const isCSVEmpty = async (fileData) => {
    const readableData = await readFileAsync(fileData);
    const parsedData = Papa.parse(readableData, { header: false, skipEmptyLines: true });

    return parsedData.data.length === 0;
  };

  async function csvFileWithKey() {
    const updateCsvData = () => {
      const indicesToRemove = csvHeaders.reduce((acc, header, index) => {
        if (header === "do_not_import") {
                acc.push(index);
            }
            return acc;
        }, []);

        if (indicesToRemove.length > 0) {
            const updatedData = csvData.data.map(row => {
                const newRow = [...row]; 
                for (let i = indicesToRemove.length - 1; i >= 0; i-=1) {
                    const index = indicesToRemove[i];
                    newRow.splice(index, 1); 
                }
                return newRow; 
            });
            return {
                data: updatedData
            };
        }
        return {
            data: csvData.data
      };
  };


    const updatedCsvData = updateCsvData();

    const uniqueHeaders = [...new Set(csvHeaders)];
    const headers = uniqueHeaders.filter(item => item && item !== "do_not_import");
    setCsvHeaders(headers)

    const rawHeaders = updatedCsvData?.data[0] || [];
    const headerIndexMap = headers.reduce((acc, header, index) => {
      const rawHeader = rawHeaders[index];
      acc[rawHeader] = header;
      return acc;
    }, {});

    const updatedSlicedEmailList = updatedCsvData.data.slice(1).reduce((acc, row) => {
      const rowData = row.reduce((acc, item, index) => {
        const header = rawHeaders[index];
        const mappedHeader = headerIndexMap[header];
        if (!mappedHeader) {
          return acc;
        }
        return { ...acc, [mappedHeader]: item };
      }, {})

      return [...acc, rowData];
    }, [])

    const _status = check ? 1 : 0;
    const checkDuplicateData = {
      email_subscribers: updatedSlicedEmailList,
      duplicate_status: _status,
    };

    const response = await Api.campaign.checkDuplicate(user?.tenant_id, checkDuplicateData);

    const existingEmails = response?.data?.existing_emails
    const filteredDuplcaitedEmailList = dedupeOnEmail(updatedSlicedEmailList.filter(emailObj => !existingEmails.includes(emailObj.email)));

    setEmailList(filteredDuplcaitedEmailList)
    setSubscribersFromParseCsv(filteredDuplcaitedEmailList);

    if (!filteredDuplcaitedEmailList?.length) {
      sendNotification({
        open: true,
        message: 'No new contacts to upload',
        alert: 'error',
      });
      throw new Error('No new contacts to upload');
    }

    return new Promise((resolve, reject) => {
      Api.campaign
        .csvFileWithKey(user?.tenant_id, {
          header: headers,
          subscribers: filteredDuplcaitedEmailList,
        })
        .then((response) => {
          resolve(response);
        })
        .catch((e) => {
          reject(e);
        });
    });
  }

  // function to handle and parse csv upload
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
        const dataSubscribers =  data?.subscribers

        console.log("dataSubscribers", dataSubscribers)

        // my custom csv issue code
        const standardHeaders = ["first_name", "last_name", "email", "job_title", "state", "country", "city", "company", "custom",];
        const createStaticRow = (standardHeaders) => {
          const staticRow = standardHeaders.reduce((acc, header) => {
            const key = header?.replace('_', ' ').replace(/\b\w/g, c => c.toUpperCase());
            return { ...acc, [header]: key };
          }, {});
        
          return staticRow;
        };
        
        const staticRow = createStaticRow(standardHeaders);
        
        
        // Match CSV headers with standard headers
        const matchHeaders = (headers, standardHeaders, dataSubscribers) => {
          const matched = headers.map((header, index) => {
              const hasEmailData = Object.values(dataSubscribers).some((row, rowIndex) => {
                  const rowData = row[index];
                  return rowData && typeof rowData === 'string' && /@.*\..*/.test(rowData);
              });
      
              if (hasEmailData) {
                  return 'eeeepresentimpsdfsdfsdad';
              }
              return header; 
          });

          const transformHeaders = (matched) => matched.map(header => {
                const headerLower = header.toLowerCase();
                if (/email/i.test(headerLower)) {
                    return 'custom';
                }
                if (headerLower === 'eeeepresentimpsdfsdfsdad') {
                    return 'email';
                }
        
                return header;
            })
          const transformHeaderData = transformHeaders(matched)

          
          const finalStandaradHeaders =  transformHeaderData.map(header => {
            const standardHeader = standardHeaders.find(standard => 
                standard.toLowerCase() === header.toLowerCase() || 
                standard.toLowerCase() === header?.replace(/\s+/g, '_').toLowerCase()
            );
            return standardHeader && standardHeader !== "do_not_import"
                ? standardHeader
                : 'custom';
        });
        return finalStandaradHeaders
      };
      
        
        const matchedHeaders = matchHeaders(headers, standardHeaders, dataSubscribers);
        setCsvHeaders(matchedHeaders)

        // ends here

        if (Object.keys(response?.data?.subscribers)?.length > 4000) {
          sendNotification({
            open: true,
            message: 'Maximum 4000 emails allowed',
            alert: 'error',
          });
          return;
        }

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

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleOptionClick = (index) => {
    setOptions(options.map((option, i) => (i === index ? !option : false)));
    let data = [];
    if (index === 0 && !options[index]) {
      data = emailList.filter((email) => email.opens > 0);
    } else if (index === 1 && !options[index]) {
      data = emailList.filter((email) => email.clicks > 0);
    } else if (index === 2 && !options[index]) {
      data = emailList.filter((email) => email.replies > 0);
    } else {
      data = emailList;
    }
    setEmailList(data);
  };

  // handle UploadCampaignerDetails submit
  const handleUploadCampaignerDetails = async () => {
    setLoading((prev) => ({ ...prev, handleUploadCampaignerDetails: true }));

    if (csvHeaders?.length === 0) {
      sendNotification({
        open: true,
        message: 'Please select at least one',
        alert: 'error',
      });
      // setLoading((prev) => ({ ...prev, handleUploadCampaignerDetails: false }));

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

    // if (csvHeaders?.includes("do_not_import")) {
    //   sendNotification({
    //     open: true,
    //     message: 'Please assign name to do not import',
    //     alert: 'error',
    //   });
    //   // setLoading((prev) => ({ ...prev, handleUploadCampaignerDetails: false }));

    //   return;
    // }

    if (csvHeaders?.some(header => !header)) {
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
    
      if (duplicates?.length !== 0) {
        sendNotification({
          open: true,
          message: 'Duplicate fields are not allowed',
          alert: 'error',
        });
  
        setLoading((prev) => ({ ...prev, handleUploadCampaignerDetails: false }));
        return;
      }

    // check if email field is present in all items
    const csvFileEmailLeads = csvData?.data.map((item) => {
      const keys = Object.keys(columnIndex);
      let lead = {};

      keys.forEach((keyItem, index) => {
        lead = { ...lead, [keyItem]: item[index] };
      });

      return lead;
    });
    csvFileEmailLeads.shift();

    const deduped = dedupeOnEmail(csvFileEmailLeads);
    // const removed = csvFileEmailLeads.length - deduped.length;

    /* if (removed) {
      sendNotification({
        open: true,
        message: `${removed} duplicate${removed === 1 ? "" : "s"} removed`,
        alert: 'success',
      });
    } */

    try {
    const getCsvFileWithKeyArray = await csvFileWithKey(deduped);

    
  // ! email field is not present in all items
    // const isEmailExistInAllFields = hasValidEmails(getCsvFileWithKeyArray?.data?.subscribersList);

    // if (!isEmailExistInAllFields) {
    //   sendNotification({
    //     open: true,
    //     message: 'Email field is not present in all items',
    //     alert: 'error',
    //   });

    //   setLoading((prev) => ({ ...prev, handleUploadCampaignerDetails: false }));

    //   return;
    // }
    // end - check if email field is present in all items

    setSubscribersFromParseCsv(dedupeOnEmail(getCsvFileWithKeyArray?.data?.subscribersList || []));
    setOpenModal(modalType.ConfirmCampaign);
    csvHeaders.forEach((value, index) => {
      setColumnIndex((prev) => ({ ...prev, [value]: index }));
    });
  } catch (e) {
     setLoading((prev) => ({ ...prev, handleUploadCampaignerDetails: false }));
  }

    setLoading((prev) => ({ ...prev, handleUploadCampaignerDetails: false }));
  };


  // for confirm campaign
  const handleSaveCsvEmailLeads = () => {
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
      const dedupedSubscribers = dedupeOnEmail(subscribersFromParseCsv);

      setEmailList((prev, index) => dedupeOnEmail([...prev, ...leadsData.map((lead) => ({ ...lead, id: index + 1 }))]));

      const checkDuplicateData = {
        email_subscribers: dedupedSubscribers,
        duplicate_status: _status,
        
      };


      onNewCampaignInputChange((prev) => ({
        ...prev,
        email_subscribers: dedupedSubscribers,
        duplicate_status: _status,
      }));

      // eslint-disable-next-line no-undef
      await uploadContacts(checkDuplicateData);
      setOpenModal('');
    } catch (error) {
      console.log(error);
    }
  };

  const uploadContacts = async (params) => {
    try {
      const response = await Api.campaign.checkDuplicate(user?.tenant_id, params);

      console.log("response483", response)
      const existingEmails = response?.data?.existing_emails
      const filteredEmailList = emailList.filter(emailObj => !existingEmails.includes(emailObj.email));
      setEmailList(filteredEmailList)
      console.log("emailList91", filteredEmailList)


      setTotalEmail(response?.data?.email_limit);

      if (response.data.permission === 0) {
        setOpenModal(modalType.Permission);
        return;
      }

      if (response.data.permission === 1 && response.data.duplicate_message.length > 0) {
        sendNotification({
          open: true,
          message: response.data.duplicate_message,
          alert: 'success',
        });
        setNewCampaignTab('Flow');
      } else if (response.data.permission === 1 && response.data.duplicate_message.length === 0) {
        setNewCampaignTab('Flow');
      } else {
        setOpenModal(modalType.Permission);
      }
    } catch (e) {
      ErrorHandling({ e, sendNotification });
    } finally {
      setLoading((prev) => ({ ...prev, handleLeadsSubmit: false }));
    }
  };

  // handle save list upload
  const handleSavedListUpload = async (emailSubscribersNotDeduped) => {
    const emailSubscribers = dedupeOnEmail(emailSubscribersNotDeduped);
    if (emailSubscribers.length === 0) {
      sendNotification({
        open: true,
        message: 'Please add at least one email',
        alert: 'error',
      });
      return;
    }

    setLoading((prev) => ({
      ...prev,
      saveListSubmit: true,
    }));


    setNewCampaign((prev) => ({ ...prev, email_subscribers: emailSubscribers }));

    try {
      setLoading((prev) => ({ ...prev, handleLeadsSubmit: true }));

      const response = await Api.campaign.checkDuplicate(user?.tenant_id, {
        duplicate_status: 1,
        email_subscribers: emailSubscribers,
      });

      setTotalEmail(response?.data?.email_limit);

      if (response.data.permission === 0) {
        setOpenModal(modalType.Permission);
        return;
      }

      if (response.data.permission === 1 && response.data.duplicate_message.length > 0) {
        sendNotification({
          open: true,
          message: response.data.duplicate_message,
          alert: 'success',
        });
        setNewCampaignTab('Flow');
      } else if (response.data.permission === 1 && response.data.duplicate_message.length === 0) {
        setNewCampaignTab('Flow');
      } else {
        setOpenModal(modalType.Permission);
      }
    } catch (e) {
      ErrorHandling({ e, sendNotification });
    } finally {
      setLoading((prev) => ({ ...prev, handleLeadsSubmit: false }));

      setLoading((prev) => ({
        ...prev,
        saveListSubmit: false,
      }));
    }
  };

  // handle save manual email leads upload
  const handleSaveManualEmailLeads = async (emailLeadsDataNotDeduped) => {
    const emailLeadsData = dedupeOnEmail(emailLeadsDataNotDeduped);
    setNewCampaign((prev) => ({ ...prev, email_subscribers: emailLeadsData }));
    setLoading((prev) => ({
      ...prev,
      manualEmailsSubmit: true,
    }));

    try {
      setLoading((prev) => ({ ...prev, handleLeadsSubmit: true }));

      const response = await Api.campaign.checkDuplicate(user?.tenant_id, {
        duplicate_status: 1,
        email_subscribers: emailLeadsData,
      });

      setTotalEmail(response?.data?.email_limit);

      if (response.data.permission === 0) {
        setOpenModal(modalType.Permission);
        return;
      }

      if (response.data.permission === 1 && response.data.duplicate_message.length > 0) {
        sendNotification({
          open: true,
          message: response.data.duplicate_message,
          alert: 'success',
        });
        setNewCampaignTab('Flow');
      } else if (response.data.permission === 1 && response.data.duplicate_message.length === 0) {
        setNewCampaignTab('Flow');
      } else {
        setOpenModal(modalType.Permission);
      }
    } catch (e) {
      ErrorHandling({ e, sendNotification });
    } finally {
      // setLoading((prev) => ({ ...prev, handleLeadsSubmit: false }));
      setLoading((prev) => ({
        ...prev,
        manualEmailsSubmit: true,
      }));
    }
  };

  const location = useLocation();

  const handleDelete = () => {
    if (selectedRows?.length <= 0) {
      sendNotification({
        open: true,
        message: 'Please select at least one',
        alert: 'error',
      });
      return;
    }

    const path = location.pathname;
    const lastPart = path.substring(path.lastIndexOf('/') + 1);

    // console.log(lastPart);

    if (lastPart === 'new') {
      setEmailList((prev) => prev.filter((lead) => !selectedRows.includes(lead.id)));
      onNewCampaignInputChange((prev) => ({
        ...prev,
        email_subscribers: prev.email_subscribers.filter((lead) => !selectedRows.includes(lead.id)),
      }));
      setSelectedRows([]);
      return;
    }

    Api.campaign
      .deleteContact(user?.tenant_id, {
        subscriber_id: selectedRows,
      })
      .then((response) => {
        sendNotification({
          open: true,
          message: response.data.message,
          alert: 'success',
        });
        setSelectedRows([]);
        setEmailList((prev) => prev.filter((lead) => !selectedRows.includes(lead.id)));
        onNewCampaignInputChange((prev) => ({
          ...prev,
          email_subscribers: prev.email_subscribers.filter((lead) => !selectedRows.includes(lead.id)),
        }));
      })
      .catch((e) => {
        ErrorHandling({ e, sendNotification });
      });
  };

  const handleEmailDelete = () => {
    const _emailList = emailList.filter((_email) => !selectedRows.includes(_email.id));
    setEmailList((prev, index) => _emailList.map((lead) => ({ ...lead, id: index + 1 })));
    onNewCampaignInputChange((prev) => ({
      ...prev,
      email_subscribers: _emailList.map((lead, leadIndex) => ({ ...lead, id: leadIndex + 1 })),
    }));
    setSelectedRows([]);
  };

  const handleExport = () => {
    const filteredEmailList = emailList.filter(emailItem => selectedRows.includes(emailItem.id));
    const headersCSVExport = ["Mail", "Contacted", "Opens", "Clicks", "Replied"]

    if(selectedRows.length === 0){
      sendNotification({
        open: true,
        message: 'Please select at least one',
        alert: 'error',
      });
      return;
    }

    const remappedDataForCSV = filteredEmailList?.map(item => ({
        email: item.email,
        contacted: item.contacted,
        opens: item.opens,
        clicks: item.clicks,
        replies: item.replies
    }));

    const dataToConvert = {
      data: remappedDataForCSV,
      filename: newCampaign?.campaign_name,
      delimiter: ',',
      headers: headersCSVExport
    }
    csvDownload(dataToConvert)
  }

  useEffect(() => {
    const pathUrl = location.pathname;
    const pathUrlLocation = pathUrl.substring(pathUrl.lastIndexOf('/') + 1);
    setLocationPath(pathUrlLocation)
  }, [])

  if (isLoading?.getCampaignById) {
    return (
      <Box sx={{ width: '100%', height: '150%', display: 'flex' }}>
        <Loading />
      </Box>
    );
  }


  return (
    <>
      {subscribersFromParseCsv && Object.keys(subscribersFromParseCsv)?.length > 0  || newCampaign?.email_subscribers?.length > 0? (
        <>
          {/* topbar select/filter/delete/search by email */}
          <Stack
            direction={{ xs: 'column', md: 'row' }}
            alignItems={{ xs: 'start', md: 'center' }}
            justifyContent="space-between"
          >
            <Stack direction="row" alignItems="center" spacing={1}>
              <CheckAll selectedRows={selectedRows} setSelectedRows={setSelectedRows} emailList={emailList} />
              {/* <Stack>
                <Button
                  aria-haspopup="true"
                  aria-expanded={anchorEl ? 'true' : 'false'}
                  disableElevation
                  size="small"
                  sx={{
                    color: '#333333',
                    border: '1px solid rgba(185, 190, 199, 0.6)',
                    fontSize: '14px',
                    fontWeight: 400,
                    background: '#FFFFFF',
                    borderRadius: '5px',
                  }}
                  onClick={handleClick}
                  endIcon={<KeyboardArrowDownIcon />}
                >
                  <TuneIcon sx={{ marginRight: '0.5rem', color: '#7B68EE' }} /> {'Filter'}
                </Button>
                <StyledMenu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}> */}
                  {/* <MenuItem onClick={handleClose}>
                  <Checkbox disableRipple checked={options[0]} onClick={() => handleOptionClick(0)} />
                  Contacted
                </MenuItem> */}
                  {/* <MenuItem onClick={handleClose}>
                    <Checkbox disableRipple checked={options[0]} onClick={() => handleOptionClick(0)} />
                    Opens
                  </MenuItem>
                  <MenuItem onClick={handleClose}>
                    <Checkbox disableRipple checked={options[1]} onClick={() => handleOptionClick(1)} />
                    Clicks
                  </MenuItem>
                  <MenuItem onClick={handleClose}>
                    <Checkbox disableRipple checked={options[2]} onClick={() => handleOptionClick(2)} />
                    Replied
                  </MenuItem>
                </StyledMenu>
              </Stack> */}

              {locationPath === 'edit'? (
                <Button
                  disableElevation
                  size="small"
                  sx={{ color: '#333333', border: '2px solid #E9EBF0' }}
                  onClick={handleExport}
                >
                  <BsDownload color="#FFBC01" size={20} style={{ marginRight: '8px' }} /> Export
                </Button>
              ) : ("")}
              
              
              <Button
                disableElevation
                size="small"
                sx={{ color: '#333333', border: '2px solid #E9EBF0' }}
                onClick={handleDelete}
              >
                <FaArchive color="#FD71AF" size={20} style={{ marginRight: '8px' }} /> Delete
              </Button>
            </Stack>

            <Stack direction="row" alignItems="center">
              <SearchInput placeholder="Search by email" onChange={searchConatcts} />
              {/* <AddButton text="Import" onClick={() => setOpenModal('leadUpload')} /> */}
            </Stack>
          </Stack>

          <EmailLeadsTable
            rows={emailList}
            newCampaign={newCampaign}
            subscribersFromParseCsv={subscribersFromParseCsv}
            selectedRows={selectedRows}
            setSelectedRows={setSelectedRows}
          />

          <DeleteModal
            isOpen={openModal === modalType.delete}
            name={selectedRows?.length > 1 ? 'these contacts' : 'this contact'}
            setOpenModal={setOpenModal}
            onClose={() => setOpenModal('')}
            onSubmit={handleEmailDelete}
          />
        </>
      ) : (
        <Box
          sx={{
            width: '100%',
            maxWidth: '580px',
            mx: 'auto',
          }}
        >
          {/* <CustomQuill /> */}
          <Typography variant="h4" my={{ xs: 0, sm: 1, md: 3, lg: 7, xl: 10 }} sx={{ textAlign: 'center' }}>
            Please import your leads to start!
          </Typography>
          <LeadUpload setOpenModal={setOpenModal} />
        </Box>
      )}

      {csvData && (
        <>
          <UploadCampaignerDetails
            isOpen={openModal === modalType.CampaignDetails}
            csvData={csvData}
            setCsvData={setCsvData}
            loading={loading.handleUploadCampaignerDetails}
            setOpenModal={setOpenModal}
            onSubmit={handleUploadCampaignerDetails}
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
            loading={loading.handleLeadsSubmit}
            data={{data: subscribersFromParseCsv}}
            onSubmit={() => {
              setLoading((prev) => ({ ...prev, handleLeadsSubmit: true }));
              handleSaveCsvEmailLeads();
            }}
            onClose={() => {
              setCsvData({});
              setCsvHeaders([]);
              setOpenModal('');
            }}
          />
        </>
      )}

      <UploadCsvModal
        loading={loading.uploadCsv}
        isOpen={openModal === modalType.SelectType}
        setOpenModal={setOpenModal}
        onSubmit={handleLeadsCsvUpload}
        onClose={() => setOpenModal('')}
      />

      <SaveList
        isOpen={openModal === modalType.SaveList}
        loading={loading.saveListSubmit}
        setOpenModal={setOpenModal}
        onClose={() => setOpenModal('')}
        handleLeadsSubmit={handleSavedListUpload}
      />

      <ManualEmails
        isOpen={openModal === modalType.ManualEmails}
        setOpenModal={setOpenModal}
        loading={loading.manualEmailsSubmit}
        onSubmit={handleSaveManualEmailLeads}
        onClose={() => setOpenModal('')}
      />

      <AddEmailPermission
        isOpen={openModal === modalType.Permission}
        onClose={() => {
          setOpenModal(modalType.Close);
          navigate('/');
        }}
        onSubmit={() => {}}
        emailNumber={totalEmail}
      />

      <Modal open={openModal === 'leadUpload'} onClose={() => setOpenModal('')}>
        <Box sx={style}>
          <Box
            sx={{
              padding: {
                xs: '2rem',
                md: '5rem',
              },
            }}
          >
            <LeadUpload setOpenModal={setOpenModal} />
          </Box>
        </Box>
      </Modal>
    </>
  );
};

export default Contacts;

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

const dedupeOnEmail = (data) => {
  const seen = new Set();
  const deduped = [];

  // eslint-disable-next-line no-restricted-syntax
  for (const item of data) {
    if (!seen.has(item.email)) {
      deduped.push(item);
      seen.add(item.email);
    }
  }

  return deduped;
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
