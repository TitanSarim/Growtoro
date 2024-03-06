import { Button, Card, Stack } from '@mui/material';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import { DataGrid } from '@mui/x-data-grid';
import Api from 'api/Api';
import Loading from 'components/Loading';
import { useCampaign } from 'context/CampaignContext';
import { useNotification } from 'context/NotificationContext';
import { useUser } from 'context/UserContext';
import React, { useCallback, useEffect, useState } from 'react';
import ModalsHeader from '../emails/ModalsHeader';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  maxWidth: 600,
  width: '100%',
  bgcolor: 'background.paper',
  boxShadow: 24,
  borderRadius: 2,
};

const SaveList = ({ isOpen, onClose, handleLeadsSubmit, loading }) => {
  // eslint-disable-next-line no-unused-vars
  // const [alertOpen, setAlertOpen] = useState(false);
  const { sendNotification } = useNotification();
  const { user } = useUser();
  const { isLoading, setIsLoading } = useCampaign();

  const [saveEmailList, setSaveEmailList] = useState([]);
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });

  const [rowCount, setRowCount] = useState(0);
  const [selectedRows, setSelectedRows] = useState([]);

  const saveList = useCallback(() => {
    setIsLoading((prev) => ({ ...prev, saveList: true }));
    Api.campaign
      .saveList(user?.tenant_id, paginationModel)
      .then((response) => {
        setSaveEmailList(response.data.data);
        setRowCount(response.data.total_rows);
      })
      .catch((e) => {
        console.log(e.message);
      })
      .finally(() => {
        setIsLoading((prev) => ({ ...prev, saveList: false }));
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paginationModel, user?.tenant_id]);

  useEffect(() => {
    saveList();
  }, [saveList]);

  const rows = saveEmailList
    ? saveEmailList.map((row, index) => ({
        id: index,
        names: row.name,
        email: row.emails,
      }))
    : [];

  const columns = [
    { field: 'id', headerName: 'ID' },
    {
      field: 'names',
      headerName: 'List Name',
      flex: 2.5,
      headerAlign: 'left',
      align: 'left',
    },
    { field: 'email', headerName: 'No. of emails ', flex: 1, headerAlign: 'center', align: 'center' },
  ];

  const upLoadRows = () => {
    // if greater than 1000 trigger error message alert
    if (selectedRows.length > 1000) {
      sendNotification({
        open: true,
        message: '1000 contact highest limit',
        alert: 'error',
      });
      return;
    }

    

    const emails = [];

    if (selectedRows.length > 0) {
      for (let index = 0; index < selectedRows.length; index += 1) {
        const found = saveEmailList.find((x, i) => selectedRows[index] === i);
        if (found) {
          emails.push(...found.subscribers_data);
        }
      }
      handleLeadsSubmit(emails);
    } else
      sendNotification({
        open: true,
        message: 'Select Emails',
        alert: 'error',
      });
  };

  return (
    <Modal open={isOpen} onClose={onClose}>
      <Box sx={style}>
        <ModalsHeader title="Saved List" handleClose={onClose} />
        {isLoading?.saveList ? (
          <Box sx={{ width: '100%', height: '30vh', display: 'flex' }}>
            <Loading />
          </Box>
        ) : (
          <>
            <Card sx={{ height: '70vh', width: '100%' }}>
              <DataGrid
                sx={{
                  ':focus': { outline: 'none !important' },
                  '.hover-pointer:hover': {
                    cursor: 'pointer',
                  },
                }}
                rows={rows}
                columns={columns}
                columnVisibilityModel={{
                  id: false,
                }}
                initialState={{
                  pagination: {
                    paginationModel: {
                      pageSize: 10,
                    },
                  },
                }}
                onRowSelectionModelChange={(ids) => setSelectedRows(ids)}
                checkboxSelection
                pagination
                pageSizeOptions={[10, 25, 50, 100]}
                rowCount={rowCount}
                paginationMode="server"
                paginationModel={paginationModel}
                onPaginationModelChange={setPaginationModel}
              />
            </Card>
            <Stack direction="row" justifyContent="end" alignItems="center" spacing={2} pr={1} my={1}>
              <Button
                onClick={onClose}
                variant="text"
                size="small"
                sx={{ minWidth: 'auto !important', paddingX: '1rem !important' }}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                sx={{ minWidth: 'auto !important', paddingX: '1rem !important' }}
                onClick={upLoadRows}
                disabled={loading}
              >
                {/* Upload All */}
                {loading ? 'Loading...' : ' Upload All'}
              </Button>
            </Stack>
          </>
        )}
      </Box>
    </Modal>
  );
};

export default React.memo(SaveList);
