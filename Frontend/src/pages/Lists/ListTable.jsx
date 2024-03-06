import { useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Card, IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';

import Api from 'api/Api';
import ErrorHandling from 'utils/ErrorHandling';
import { useUser } from 'context/UserContext';
import { modalType } from 'pages/Campaigns/Index';
import { useNotification } from 'context/NotificationContext';
import NewCampainModals from 'components/modal/campaign/NewCampaignNameModal';

const dataGridSx = {
  ':focus': { outline: 'none !important' },
  '.hover-pointer:hover': {
    cursor: 'pointer',
  },
};

const ListTable = ({
  tableData,
  setTableData,
  setSelectedRows,
  // selectedRows,
  paginationModel,
  setPaginationModel,
  rowCount,
}) => {
  const [openModal, setOpenModal] = useState('');
  const [id, setId] = useState(undefined);

  const { user } = useUser();
  const { sendNotification } = useNotification();

  const handleUpdate = (value) => {
    Api.emailList
      .updateEmailList(user?.tenant_id, { id, list_name: value })
      .then(() => {
        const newArray = tableData.map((item) => {
          if (item.id === id) {
            return { ...item, name: value };
          }
          return item;
        });

        setTableData(newArray);
        setOpenModal('');
      })
      .catch((e) => {
        ErrorHandling({ e, sendNotification });
      });
  };

  const columns = [
    // { field: 'id', headerName: 'ID' },
    {
      field: 'id',
      headerName: 'ID',
      flex: 2.5,
      headerAlign: 'left',
      align: 'left',
    },
    {
      field: 'names',
      headerName: 'Name',
      flex: 2.5,
      headerAlign: 'left',
      align: 'left',
    },
    {
      field: 'types',
      headerName: 'Type',
      flex: .6,
      headerAlign: 'left',
      align: 'left',
    },
    {
      field: 'last_modified',
      headerName: 'Last Modified',
      flex: 1,
      headerAlign: 'center',
      align: 'center',
    },
    {
      field: 'owners',
      headerName: 'Owner',
      flex: 1,
      headerAlign: 'center',
      align: 'center',
    },

    {
      field: 'record',
      headerName: 'Records',
      flex: 1,
      headerAlign: 'center',
      align: 'center',
    },

    {
      field: 'edit',
      headerName: 'Edit',
      flex: 0.7,
      headerAlign: 'center',
      align: 'center',
      renderCell: (params) => (
        <IconButton
          onClick={(e) => {
            setId(params.row.id);
            setOpenModal(modalType.name);
            e.stopPropagation();
          }}
        >
          <EditIcon style={{ color: 'rgb(138, 143, 153)', fontSize: '1.3rem', zIndex: 999 }} />
        </IconButton>
      ),
    },
  ];


    console.log("tableData121", tableData)
  const rows = tableData?.map((row) => ({
    id: row.id,
    names: row.name,
    types: row.type,
    last_modified: row.lastModified,
    owners: row.owner,
    record: row.emails,
    edit: null,
  }));

  return (
    <Card sx={{ height: '75vh', width: '100%' }}>
      <DataGrid
        rows={rows}
        columns={columns}
        sx={dataGridSx}
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
        pagination
        pageSizeOptions={[10, 25, 50, 100]}
        rowCount={rowCount}
        paginationMode="server"
        paginationModel={paginationModel}
        onPaginationModelChange={setPaginationModel}
      />

      <NewCampainModals
        title="Update list name"
        placeholder="List Name"
        isOpen={openModal === modalType.name}
        onSubmit={handleUpdate}
        onClose={() => setOpenModal(modalType.close)}
      />
    </Card>
  );
};

export default ListTable;
