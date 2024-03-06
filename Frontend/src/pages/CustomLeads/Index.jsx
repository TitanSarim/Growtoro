import { useEffect, useState } from 'react';
import { Box, Button, IconButton } from '@mui/material';

import Api from 'api/Api';

import { useNotification } from 'context/NotificationContext';
import { useUser } from 'context/UserContext';
import { HeaderTitle } from 'utils/typography';

import FaqModal from 'components/modal/customLeads/FaqModal';
import ErrorHandling from 'utils/ErrorHandling';
import CustomLeadB2B from './Platforms/B2B';
import CustomLeadB2C from './Platforms/B2C';

const noti = [
  {
    label: 'faq',
    icon: '/assets/icons/ic_infopopover.svg',
  },
];

export const CustomLeads = () => {
  const { user } = useUser();
  const { sendNotification } = useNotification();
  const [b2b, setB2B] = useState(true);
  const [faqData, setFaqData] = useState();
  const [open, setOpen] = useState({
    openModal: '',
  });
  const handleOpenB2b = () => {
    setB2B(!b2b);
  };

  const handleOpen = () => {
    setOpen((prev) => ({ ...prev, openModal: 'faq' }));
  };

  useEffect(() => {
    Api.leads
      .customLeadFaqs(user?.tenant_id)
      .then((res) => {
        setFaqData(res.data);
      })
      .catch((e) => {
        ErrorHandling({ e, sendNotification });
      })
      .finally(() => {
        // setIsLoading((prev) => ({ ...prev, getCampaignById: false }));
      });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.tenant_id]);

  return (
    <>
      <Box
        sx={{
          background: '#FFFFFF',
          boxShadow: '0px 8px 24px rgba(189, 206, 212, 0.2)',
          borderRadius: '10px',
          width: '35rem',
          margin: 'auto',
          p: '1.2rem 1.9rem',
          maxHeight: '90vh',
          overflowY: 'auto',
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <HeaderTitle>Custom Lead Order</HeaderTitle>
          <IconButton
            onClick={handleOpen}
            sx={{
              padding: '0 0 1rem 0',
              width: 40,
              height: 40,
              '&:hover': {
                background: 'none',
              },
            }}
          >
            <img src={noti[0].icon} alt={noti[0].label} />
          </IconButton>
        </Box>
        <FaqModal
          isOpen={open.openModal === 'faq'}
          setOpen={setOpen}
          onSubmit={() => {}}
          onClose={() => setOpen((prev) => ({ ...prev, openModal: '' }))}
          accordData={faqData?.faqs}
        />
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            mt: 1,
            mb: 3,
            border: '1px solid #C3B9B9',
            borderRadius: '10px',
            padding: '4px',
          }}
        >
          <Button
            variant={b2b ? 'contained' : ''}
            sx={{ fontWeight: '400', fontFamily: 'Inter', minWidth: '50% !important' }}
            size="medium"
            onClick={handleOpenB2b}
          >
            B2B
          </Button>
          <Button
            variant={b2b ? '' : 'contained'}
            sx={{ fontWeight: '400', fontFamily: 'Inter', minWidth: '50% !important' }}
            size="medium"
            onClick={handleOpenB2b}
          >
            B2C
          </Button>
        </Box>
        {b2b ? <CustomLeadB2B faqData={faqData} /> : <CustomLeadB2C faqData={faqData} />}
        {/* <Box
          sx={{
            background: '#FFFFFF',
            boxShadow: '0px 8px 24px rgba(189, 206, 212, 0.2)',
            borderRadius: '10px',
            width: '31.5rem',
            mt: 2,
          }}
        >
          <FaqQuestions accordData={accordData1} />
        </Box> */}
      </Box>
    </>
  );
};
