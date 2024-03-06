import { useEffect, useState } from 'react';
import { Button, Stack } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { FaArchive } from 'react-icons/fa';

import Api from 'api/Api';
import Tag from 'components/filter/Tag';
import Loading from 'components/Loading';
import Export from 'components/filter/Export';

import { AddButton } from 'components/button/buttons';
import DataContainer from 'components/DataContainer';
import SearchInput from 'components/input/SearchInput';
import DeleteModal from 'components/modal/campaign/DeleteModal';
import AllCampaigns from 'components/DataContainer/AllCampaigns';
import NewCampaignNameModal from 'components/modal/campaign/NewCampaignNameModal';

import { HeaderTitle } from 'utils/typography';
import { useUser } from 'context/UserContext';
import { useCampaign } from 'context/CampaignContext';
import { useNotification } from 'context/NotificationContext';

// import ErrorHandling from 'utils/ErrorHandling';

export const modalType = {
  name: 'name',
  close: 'close',
  delete: 'delete',
};

const Index = () => {
  const { user } = useUser();
  const {
    campaigns,
    newCampaign,
    setNewCampaign,
    setCampaigns,
    onNewCampaignInputChange,
    getAllCampaign,
    setNewCampaignTab,
    isLoading,
    deleteCampaign,
    cloneCampaign,
    // totalEmail,
    setTotalEmail,
  } = useCampaign();
  const navigate = useNavigate();
  const { sendNotification } = useNotification();

  const [openModal, setOpenModal] = useState('');
  const [selectedRows, setSelectedRows] = useState([]);
  const [value, setValue] = useState('');

  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });

  const handleNewCampaignInit = (campaignName) => {
    onNewCampaignInputChange({ ...newCampaign, campaign_name: campaignName });

    navigate(`/campaigns/new`);
    setNewCampaignTab('Contacts');
    setOpenModal(modalType.close);
  };

  const handleDelete = () => {
    if (selectedRows.length > 0) setOpenModal(modalType.delete);
    else {
      sendNotification({
        open: true,
        message: 'Select campaign',
        alert: 'error',
      });
    }
  };

  const handleDuplicate = () => {
    if (selectedRows.length > 0) {
      cloneCampaign(user?.tenant_id, selectedRows);
      setSelectedRows([]);
    } else {
      sendNotification({
        open: true,
        message: 'Select campaign',
        alert: 'error',
      });
    }
  };

  const handleCampaginDelete = () => {
    deleteCampaign(user?.tenant_id, selectedRows);
  };

  const searchCampaign = (e) => {
    setValue(e);
  };

  useEffect(() => {
    if (value?.length < 1) {
      Api.campaign.getAllCampaign(user?.tenant_id, paginationModel).then((response) => {
        setCampaigns(response.data.data);
      });
    } else {
      Api.campaign.searchByEmail(user?.tenant_id, { ...paginationModel, q: value }).then((response) => {
        setCampaigns(response.data.data);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, user?.tenant_id, paginationModel]);

  useEffect(() => {
    getAllCampaign(user?.tenant_id, paginationModel);
    Api.plan
      .getActivePlan(user.tenant_id)
      .then((res) => {
        setTotalEmail(res.data.data.plan_number_users ? res.data.data.plan_number_users : 15000);
      })
      .catch(() => {
        // console.log(e);
        // ErrorHandling({ e, sendNotification });
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paginationModel, user?.tenant_id]);

  if (isLoading.getAllCampaign) return <Loading />;

  console.log("campaigns", campaigns)

  return (
    <>
      <HeaderTitle>All Campaigns</HeaderTitle>

      {/* Tag/export/delete/duplicate/search/add new */}
      <Stack
        direction={{ xs: 'column', md: 'row' }}
        alignItems={{ xs: 'start', md: 'center' }}
        justifyContent="space-between"
      >
        <Stack direction="row" alignItems="center" spacing={1}>
          {/* tag */}
          <Tag label="Tag" />

          {/* export  */}
          <Export label="Export" rows={campaigns} />

          {/* delete  */}
          <Button
            disableElevation
            size="small"
            sx={{ color: '#333333', border: '2px solid #E9EBF0' }}
            onClick={handleDelete}
          >
            <FaArchive color="#FD71AF" size={20} style={{ marginRight: '8px' }} /> Delete
          </Button>

          {/* duplicate  */}
          <Button
            disableElevation
            size="small"
            startIcon={<img src="/assets/images/duplicate.png" alt="" style={{ width: '22px' }} />}
            sx={{ color: '#333333', border: '2px solid #E9EBF0' }}
            onClick={handleDuplicate}
          >
            Duplicate
          </Button>
        </Stack>
        <Stack direction="row" alignItems="center">
          <SearchInput placeholder="Search by campaign" value={value} onChange={searchCampaign} />
          <AddButton onClick={() => setOpenModal(modalType.name)} id="add-new-campaign" />
        </Stack>
      </Stack>

      {/* Table */}
      <Stack direction="column" alignItems="center" justifyContent="center">
        {/* {value ? (
          <div
            style={{
              width: '100%',
              height: 'calc(100vh - 200px)',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <p>No item found</p>
          </div>
        ) : ( */}

        {/* {
          campaigns?.length === 0 && !value === 0 ? (

        } */}

        {campaigns?.length === 0 && value ? (
          <div
            style={{
              width: '100%',
              height: 'calc(100vh - 200px)',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <p>No item found</p>
          </div>
        ) : (
          <DataContainer
            errorImg={'/assets/images/allcampain.png'}
            errorMessage="You don't have any campaigns yet. Please add your first campaign!"
            errorLink={<AddButton onClick={() => setOpenModal(modalType.name)} />}
            data={campaigns}
          >
            {campaigns && (
              <AllCampaigns
                data={campaigns}
                setSelectedRows={setSelectedRows}
                paginationModel={paginationModel}
                setPaginationModel={setPaginationModel}
              />
            )}
          </DataContainer>
        )}

        {/* )} */}

        <NewCampaignNameModal
          title="Let's create a new campaign"
          placeholder="Campaign Name"
          isOpen={openModal === modalType.name}
          onSubmit={handleNewCampaignInit}
          onClose={() => setOpenModal(modalType.close)}
        />
        <DeleteModal
          isOpen={openModal === modalType.delete}
          name={selectedRows.length > 1 ? 'these campaigns' : 'this campaign'}
          setOpenModal={setOpenModal}
          onClose={() => setOpenModal(modalType.close)}
          onSubmit={handleCampaginDelete}
        />
      </Stack>
    </>
    // </Layout>
  );
};

export default Index;
