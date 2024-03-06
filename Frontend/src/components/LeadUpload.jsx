import { Box, Grid } from '@mui/material';
import { modalType } from '_mock/defines';
// import { useCampaign } from 'context/CampaignContext';
// import { useUser } from 'context/UserContext';
import { PlainText } from 'utils/typography';

const images = [
  {
    icon: '/assets/images/csv.png',
    tag: 'Upload',
    name: 'CSV',
  },
  {
    icon: '/assets/images/list.png',
    tag: 'Use',
    name: 'Saved List',
  },
  {
    icon: '/assets/icons/keyboard.svg',
    tag: 'Enter',
    name: 'Emails Manually',
  },
];

const LeadUpload = ({ setOpenModal }) => (
  // const { saveList } = useCampaign();
  // const { user } = useUser();
  <Grid container spacing={'2%'} gap={'2%'}>
    {images?.map((values, index) => (
      <Grid item xs={12} key={index}>
        <Box
          id={`${values.tag}-${values.name}`}
          sx={{
            background: '#FFFFFF',
            // border: '2px solid #7B68EE',
            borderRadius: '10px',
            boxShadow: 'rgb(235 235 235) 0px 2px 5px',
            padding: '2vh 1vw',
            display: 'flex',
            justifyContent: 'start',
            alignItems: 'center',
            cursor: 'pointer',
            transition: '0.5s ease',
            '&:hover': {
              boxShadow: 12,
              border: '1px solid rgb(60, 60, 60)',
            },
            mb: '2vh',
          }}
          onClick={() => {
            if (values?.name === 'CSV') {
              setOpenModal(modalType.SelectType);
            } else if (values?.name === 'Saved List') {
              setOpenModal(modalType.SaveList);
            } else if (values?.name === 'Emails Manually') {
              setOpenModal(modalType.ManualEmails);
            }
          }}
        >
          <Box sx={{ pr: '1vw', width: '15%', height: '15%' }}>
            <img src={values?.icon} alt="file" width="100%" height="100%" />
          </Box>

          <Box sx={{ pl: '2vw', borderLeft: '1px solid rgb(189, 189, 189)', borderColor: 'grey.400' }}>
            <PlainText fontSize="18px" pb="1vh" color="grey.500" textAlign="start">
              {values?.tag}
            </PlainText>
            <PlainText
              fontSize={{ xs: '20px', sm: '28px', md: '30px', lg: '35ps' }}
              color="black"
              fontWeight="bold"
              textAlign="start"
            >
              {values?.name}
            </PlainText>
          </Box>
        </Box>
      </Grid>
    ))}
  </Grid>
);
export default LeadUpload;
