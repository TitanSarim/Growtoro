import { Card, FormControlLabel, IconButton, Tooltip } from '@mui/material';
import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';
import { IOSSwitch } from 'components/button/CustomSwitch';
import { useCampaign } from 'context/CampaignContext';
import { useUser } from 'context/UserContext';
import { useState } from 'react';
import { FaRegEdit, FaExternalLinkAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

export default function AllCampaigns({ data, setSelectedRows, paginationModel, setPaginationModel }) {
  const { setNewCampaignTab, updateStatusSwitch, rowCount } = useCampaign();
  const navigate = useNavigate();
  const { user } = useUser();
  console.log(data);

  const handleRowClick = (e) => {
    navigate(`/campaigns/${e.id}/edit`);
    setNewCampaignTab('Analytics');
  };

  const onSwitchChange = (campaignId, isChecked) => {
    const _status = isChecked ? 1 : 0;

    updateStatusSwitch(user?.tenant_id, {
      id: campaignId,
      status: _status,
    });
  };

  const columns = [
    { field: 'id', headerName: 'ID' },
    {
      field: 'names',
      headerName: 'Campaign Name',
      flex: 2.5,
      headerAlign: 'left',
      align: 'left',
      renderCell: (params) => (
        <>
          <Box sx={{ display: 'grid' }}>
            <Box sx={{ fontWeight: '800', fontSize: '18px' }}>{params.value.campaign_name}</Box>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Box sx={{ color: '#7b68ee', fontSize: '16px' }}>{params.value.from_name}</Box>
              <span> . </span>
              <Box>{params.value.created_at}</Box>
            </Box>
          </Box>
        </>
      ),
    },
    {
      field: 'openInNewTab',
      headerName: 'Open New Tab',
      flex: 0.7,
      headerAlign: 'center',
      align: 'center',
      renderCell: (params) => (
        <IconButton
          size="small"
          onClick={(event) => {
            event.stopPropagation();
            window.open(`/campaigns/${params.row.id}/edit`, '_blank');
          }}
          style={{ backgroundColor: 'transparent', boxShadow: 'none' }}
        >
          <Tooltip title="Open in New Tab" arrow>
            <FaExternalLinkAlt size={16} color="#545151" />
          </Tooltip>
        </IconButton>
      ),
    },
    {
      field: 'delivered',
      headerName: 'Delivered',
      flex: 1,
      headerAlign: 'center',
      align: 'center',
    },
    {
      field: 'open',
      headerName: 'Opened',
      flex: 1,
      headerAlign: 'center',
      align: 'center',
    },

    {
      field: 'replied',
      headerName: 'Replies',
      flex: 1,
      headerAlign: 'center',
      align: 'center',
    },
    {
      field: 'clicks_count',
      headerName: 'Clicks',
      flex: 1,
      headerAlign: 'center',
      align: 'center',
    },
    {
      field: 'activate',
      headerName: 'Activate',
      flex: 0.7,
      headerAlign: 'center',
      align: 'center',
      renderCell: (params) => (
        <IconButton
          size="small"
          onClick={(event) => {
            event.stopPropagation();
            onSwitchChange(params.row.id, event.target.checked);
          }}
          disableRipple
          style={{ backgroundColor: 'transparent', boxShadow: 'none' }}
        >
          <FormControlLabel
            control={<IOSSwitch defaultChecked={params.row.activate} sx={{ m: 1 }} />}
            sx={{ mx: '0 !important' }}
          />
        </IconButton>
      ),
    },
    {
      field: 'edit',
      headerName: 'Edit',
      flex: 0.3,
      headerAlign: 'start',
      align: 'center',
      renderCell: () => <FaRegEdit size={25} color="#545151" style={{ zIndex: 1500 }} />,
    },
  ];

  const rows = data?.map((row) => ({
    id: row.id,
    names: {
      campaign_name: row.campaign_name,
      from_name: row.from_name[row.from_name.length - 1],
      created_at: row.campaign_date,
    },
    delivered: row.emails_count,
    open: row.opens_count,
    replied: row.replies_count,
    clicks_count: row.clicks_count,
    activate: row.status === 1,
    edit: null,
    openInNewTab: null,
  }));

  const getRowClassName = () => 'hover-pointer';

  return (
    <Card sx={{ height: '75vh', width: '100%' }}>
      <DataGrid
        sx={{
          ':focus': { outline: 'none !important' },
          '.hover-pointer:hover': {
            cursor: 'pointer',
          },
        }}
        rows={rows}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 10,
            },
          },
        }}
        getRowClassName={getRowClassName}
        columnVisibilityModel={{
          id: false,
        }}
        onRowClick={handleRowClick}
        onRowSelectionModelChange={(ids) => setSelectedRows(ids)}
        checkboxSelection
        pageSizeOptions={[10, 25, 50, 100]}
        pagination
        paginationModel={paginationModel}
        paginationMode="server"
        onPaginationModelChange={setPaginationModel}
        rowCount={rowCount}
      />
    </Card>
  );
}