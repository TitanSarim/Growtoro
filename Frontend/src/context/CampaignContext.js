import { createContext, useCallback, useContext, useState } from 'react';
import { HiHomeModern } from 'react-icons/hi2';
import {
  MdAddCircleOutline,
  MdOutlineEmail,
  MdOutlineHomeWork,
  MdOutlineRealEstateAgent,
  MdSubtitles,
} from 'react-icons/md';
import { useNavigate } from 'react-router-dom';

import Api from 'api/Api';
import ErrorHandling from 'utils/ErrorHandling';
import { tabitems } from '_mock/tabItems';
import { useNotification } from './NotificationContext';

const CampaignContext = createContext();

export const useCampaign = () => useContext(CampaignContext);

export const CampaignProvider = ({ children }) => {
  const navigate = useNavigate();
  const { sendNotification } = useNotification();

  const [subscribersFromParseCsv, setSubscribersFromParseCsv] = useState([]);
  const [campaigns, setCampaigns] = useState([]);
  const [totalEmail, setTotalEmail] = useState(0);
  const [Load, setLoad] = useState(false);

  const [newCampaign, setNewCampaign] = useState({
    campaign_name: '',
    subject: '',
    delay_email: '',
    email_body: '',
    start_at: '',
    start_date: '',
    stop_at: '',
    time_zone: '',
    days: [],
    from_email: '',
    list_id: null,
    smtp_id: '',
    max_email: '',
    status: 0,
    from_name: '',
    stop_on_reply: 0,
    tracking: 0,
    email_subscribers: [],
  });

  const [editCampaign, setEditCampaign] = useState({});

  const [newCampaignTab, setNewCampaignTab] = useState(tabitems[1].title);

  const onNewCampaignInputChange = (_updatedValues) => {
    setNewCampaign(_updatedValues);
  };

  const [isLoading, setIsLoading] = useState({
    updateCampaign: false,
    updateLaunchPauseCampaign: false,
  }); 

  const [typeData, setTypeData] = useState([
    {
      type: [
        {
          name: 'SendingAccountFullName',
          image: <img src={'/assets/icons/firstName.svg'} alt="icon" style={{ marginRight: '10px' }} />,
          value: 'sending_account_full_name',
        },
        {
          name: 'First Name',
          image: <img src={'/assets/icons/firstName.svg'} alt="icon" style={{ marginRight: '10px' }} />,
          value: 'first_name',
        },
        {
          name: 'Last Name',
          image: <img src={'/assets/icons/lastName.svg'} alt="icon" style={{ marginRight: '10px' }} />,
          value: 'last_name',
        },
        {
          name: 'Email',
          image: <MdOutlineEmail size={20} style={{ marginRight: '10px', color: 'blue' }} />,
          value: 'email',
        },
        {
          name: 'Job Title',
          image: <MdSubtitles size={20} style={{ marginRight: '10px', color: 'blue' }} />,
          value: 'job_title',
        },

        {
          name: 'State',
          image: <MdOutlineRealEstateAgent size={20} style={{ marginRight: '10px', color: 'blue' }} />,
          value: 'state',
        },
        {
          name: 'Country',
          image: <HiHomeModern size={20} style={{ marginRight: '10px', color: 'blue' }} />,
          value: 'country',
        },
        {
          name: 'City',
          image: <MdOutlineHomeWork size={20} style={{ marginRight: '10px', color: 'blue' }} />,
          value: 'city',
        },

        {
          name: 'Company',
          image: <MdOutlineHomeWork size={20} style={{ marginRight: '10px', color: 'blue' }} />,
          value: 'company',
        },

        {
          name: 'Custom',
          image: <MdAddCircleOutline size={20} style={{ marginRight: '10px', color: 'green' }} />,
          value: 'custom',
        },
        {
          name: 'Do not import',
          image: <img src={'/assets/icons/import.svg'} alt="icon" style={{ marginRight: '10px' }} />,
          value: 'do_not_import',
        },
      ],
    },
  ]);

  const [analyticsData, setAnalyticsData] = useState();
  const [rowCount, setRowCount] = useState(0);

  const getAllCampaign = useCallback(
    (credentials, params) => {
      setIsLoading((prev) => ({ ...prev, getAllCampaign: true }));
      setEditCampaign({});

      setNewCampaign({
        campaign_name: '',
        subject: '',
        delay_email: '',
        email_body: '',
        start_at: '',
        start_date: '',
        stop_at: '',
        time_zone: '',
        days: [],
        from_email: '',
        list_id: null,
        smtp_id: '',
        max_email: '',
        status: 0,
        from_name: '',
        stop_on_reply: 0,
        tracking: 0,
        email_subscribers: [],
      });

      Api.campaign
        .getAllCampaign(credentials, params)
        .then((response) => {
          setCampaigns(response.data.data);
          setRowCount(response.data.total_rows);
        })
        .catch((e) => {
          let _err = [];
          const errors = e?.response?.data?.message;
          if (errors) {
            Object.values(errors).forEach((value) => {
              _err = [..._err, ...value];
            });
            sendNotification({
              open: true,
              message: _err[0],
              alert: 'error',
            });
          } else {
            _err = e?.message;
            sendNotification({
              open: true,
              message: _err,
              alert: 'error',
            });
          }
        })
        .finally(() => {
          setIsLoading((prev) => ({ ...prev, getAllCampaign: false }));
        });
    },
    [sendNotification]
  );

  const getCampaignById = useCallback(
    (tenantId, id) => {
      setIsLoading((prev) => ({ ...prev, getCampaignById: true }));
      setLoad(true);
      Api.campaign
        .getCampaignById(tenantId, id)
        .then((response) => {
          setEditCampaign(response.data.data);
          setNewCampaign(response.data.data);
          // setEmailList(response.data.data.email_subscribers);
        })
        .catch((e) => {
          const errors = e.message;
          sendNotification({
            open: true,
            message: errors,
            alert: 'error',
          });
        })
        .finally(() => {
          setIsLoading((prev) => ({ ...prev, getCampaignById: false }));
        });
    },
    [sendNotification]
  );

  const createCampaign = (tenantId, extraParams) => {
    const newStatus = extraParams.status !== undefined ? extraParams.status : newCampaign.status;
    Api.campaign
      .createCampaign(tenantId, {
        campaign_name: newCampaign.campaign_name,
        from_name: newCampaign.from_name,
        from_email: newCampaign.from_email,
        smtp_id: newCampaign.smtp_id,
        subject: newCampaign.subject,
        email_body: newCampaign.email_body,
        days: newCampaign.time_filter.days.split(','),
        delay_email: newCampaign.delay_email,
        status: newStatus,
        start_at: newCampaign.time_filter.start_at,
        stop_at: newCampaign.time_filter.stop_at,
        start_date: newCampaign.time_filter.start_date,
        time_zone: newCampaign.time_filter.time_zone,
        max_email: newCampaign.max_email,
        tracking: newCampaign.tracking,
        stop_on_reply: newCampaign.stop_on_reply,
        sequences: newCampaign.sequences,
        email_subscribers: newCampaign.email_subscribers,
        duplicate_status: newCampaign.duplicate_status,
      })
      .then((res) => {
        setCampaigns([]);
        const x = res.data.data;
        if (newStatus === 1) {
          navigate('.', {replace: true})
          sendNotification({
            open: true,
            message: res.data.message,
            alert: 'success',
          });
        } else {
          navigate(`/campaigns/${x}/edit`);
          sendNotification({
            open: true,
            message: "Campaign saved successfully",
            alert: 'success',
          });
        }
       })
      .catch((e) => {
        if (newCampaign.status === 1) onNewCampaignInputChange((prev) => ({ ...prev, status: 0 }));
        ErrorHandling({ e, sendNotification });
      })
      .finally(() => {
        setIsLoading((prev) => ({ ...prev, createSaveCampaign: false }));
        setIsLoading((prev) => ({ ...prev, createLaunchCampaign: false }));
        setIsLoading((prev) => ({ ...prev, updateCampaign: false }));
      });
  };

  const updateCampaign = (tenantId, extraParams, silentUpdate = true) => {
    // if (silentUpdate) setIsLoading((prev) => ({ ...prev, updateLaunchPause: true }));
    // console.log('updateCampaign ', newCampaign);
    const newStatus = extraParams.status !== undefined ? extraParams.status : newCampaign.status;
    Api.campaign
      .updateCampaign(tenantId, {
        drip_id: newCampaign.id,
        campaign_name: newCampaign.campaign_name,
        days: newCampaign.time_filter.days.split(','),
        delay_email: newCampaign.delay_email,
        email_body: newCampaign.email_body,
        max_email: newCampaign.max_email,
        smtp_id: newCampaign.smtp_id,
        subject: newCampaign.subject,
        status: newStatus,
        start_at: newCampaign.time_filter.start_at,
        start_date: newCampaign.time_filter.start_date,
        stop_at: newCampaign.time_filter.stop_at,
        time_zone: newCampaign.time_filter.time_zone,
        tracking: newCampaign.tracking,
        stop_on_reply: newCampaign.stop_on_reply,
        sequences: newCampaign.sequences,
        email_subscribers: newCampaign.email_subscribers,
        duplicate_status: newCampaign.duplicate_status,
      })
      .then(() => {
        setEditCampaign({});
        setCampaigns([]);
        if (silentUpdate) {
          navigate('.', {replace: true})
          sendNotification({
            open: true,
            message: 'Updated Successfully',
            alert: 'success',
          });
        }
      })
      .catch((e) => {
        ErrorHandling({ e, sendNotification });
      })
      .finally(() => {
        setIsLoading((prev) => ({ ...prev, createSaveCampaign: false }));
        setIsLoading((prev) => ({ ...prev, createLaunchCampaign: false }));
        setIsLoading((prev) => ({ ...prev, updateLaunchPauseCampaign: false }));
        setIsLoading((prev) => ({ ...prev, updateCampaign: false }));
      });
  };

  const updateCampaignFlow = (tenantId, params) => {
    setIsLoading((prev) => ({ ...prev, updateCampaign: true }));
    // console.log('updateCampaignFlow ', newCampaign);
    Api.campaign
      .updateCampaign(tenantId, {
        drip_id: newCampaign.id,
        campaign_name: newCampaign.campaign_name,
        days: newCampaign.time_filter.days.split(','),
        delay_email: newCampaign.delay_email,
        email_body: params[0].sq_body,
        max_email: newCampaign.max_email,
        smtp_id: newCampaign.smtp_id,
        subject: params[0].sq_subject,
        status: newCampaign.status,
        start_at: newCampaign.time_filter.start_at,
        start_date: newCampaign.time_filter.start_date,
        stop_at: newCampaign.time_filter.stop_at,
        time_zone: newCampaign.time_filter.time_zone,
        tracking: newCampaign.tracking,
        stop_on_reply: newCampaign.stop_on_reply,
        sequences: params,
        email_subscribers: newCampaign.email_subscribers,
        duplicate_status: newCampaign.duplicate_status,
      })
      .then(() => {
        sendNotification({
          open: true,
          message: 'Updated Successfully',
          alert: 'success',
        });
        window.location.reload()
      })
      .catch((e) => {
        ErrorHandling({ e, sendNotification });
      })
      .finally(() => {
        setIsLoading((prev) => ({ ...prev, createSaveCampaign: false }));
        setIsLoading((prev) => ({ ...prev, createLaunchCampaign: false }));
        setIsLoading((prev) => ({ ...prev, updateCampaign: false }));
      });
  };

  const sendTestEmail = useCallback(async (tenantId, params, setOpenModal) => {
    setIsLoading((prev) => ({ ...prev, sendTestEmail: true }));
    Api.campaign
      .sendTestEmail(tenantId, params)
      .then((res) => {
        setOpenModal('');
        sendNotification({
          open: true,
          message: res.data.message,
        });
      })
      .catch((e) => {
        ErrorHandling({ e, sendNotification });
      })
      .finally(() => {
        setIsLoading((prev) => ({ ...prev, sendTestEmail: false }));
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const deleteCampaign = (tenantId, _id) => {
    Api.campaign
      .removeCampaign(tenantId, { drip_id: _id })
      .then(() => {
        sendNotification({
          open: true,
          message: 'Campaign deleted Successfully',
          alert: 'success',
        });
        // if (res.status === 200) {
        //   const campaign = campaigns.filter((_campaign) => !_id.includes(_campaign.id));
        //   setCampaigns(campaign);
        // }
        getAllCampaign(tenantId, {
          page: 0,
          pageSize: 10,
        });
      })
      .catch(() => {
        console.log('not deleted');
        sendNotification({
          open: true,
          message: 'Something went wrong',
          alert: 'error',
        });
      });
  };

  const cloneCampaign = (tenantId, _id) => {
    Api.campaign
      .cloneCampaign(tenantId, { ids: _id })
      .then((res) => {
        sendNotification({
          open: true,
          message: res.data.success,
          alert: 'success',
        });
        getAllCampaign(tenantId, {
          page: 0,
          pageSize: 10,
        });
      })
      .catch((e) => {
        ErrorHandling({ e, sendNotification });
      });
  };

  const updateCamapaignStatus = async (tenantId, params) => {
    setIsLoading((prev) => ({ ...prev, updateCamapaignStatus: true }));
    Api.campaign
      .updateCampaignStatus(tenantId, params)
      .then(() => {
        setEditCampaign({});
        setCampaigns([]);
        sendNotification({
          open: true,
          message: params.status ? 'Campaign activated' : 'Campaign paused',
          alert: 'success',
        });
        navigate('/');
      })
      .catch((e) => {
        onNewCampaignInputChange((prev) => ({ ...prev, status: params.status === 1 ? 0 : 1 }));
        ErrorHandling({ e, sendNotification });
      })
      .finally(() => {
        setIsLoading((prev) => ({ ...prev, updateCamapaignStatus: false }));
      });
  };

  const updateStatusSwitch = async (tenantId, params) => {
    Api.campaign
      .updateCampaignStatus(tenantId, params)
      .then(() => {
        setEditCampaign({});
        const newAnalytics = analyticsData?.campaigns?.map((item) => {
          if (item.id === params.id) {
            return { ...item, status: params.status === 1 };
          }
          return item;
        });
        setAnalyticsData({ campaigns: newAnalytics, email_account: analyticsData.email_account });
        const newCampaigns = campaigns.map((item) => {
          if (item.id === params.id) {
            return { ...item, status: params.status };
          }
          return item;
        });
        setCampaigns(newCampaigns);
        sendNotification({
          open: true,
          message: params.status ? 'Campaign activated' : 'Campaign paused',
          alert: 'success',
        });
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const analyticsList = async (tenantId) => {
    Api.campaign
      .analyticsList(tenantId)
      .then((res) => setAnalyticsData(res.data))
      .catch((e) => ErrorHandling({ e, sendNotification }));
  };

  const value = {
    campaigns,
    setCampaigns,
    newCampaign,
    newCampaignTab,
    isLoading,
    editCampaign,
    setNewCampaign,
    setNewCampaignTab,
    onNewCampaignInputChange,
    getAllCampaign,
    getCampaignById,
    setIsLoading,
    setEditCampaign,
    createCampaign,
    updateCampaign,
    Load,
    setLoad,
    deleteCampaign,
    updateCamapaignStatus,
    updateStatusSwitch,
    // saveEmailList,
    analyticsList,
    analyticsData,
    setAnalyticsData,
    rowCount,
    sendTestEmail,
    updateCampaignFlow,
    typeData,
    setTypeData,
    cloneCampaign,
    totalEmail,
    setTotalEmail,
    subscribersFromParseCsv,
    setSubscribersFromParseCsv,
  };

  return <CampaignContext.Provider value={value}>{children}</CampaignContext.Provider>;
};
