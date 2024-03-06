// import { Box, Button, Grid, Modal, Stack, TextareaAutosize, TextField, Typography } from '@mui/material';
// import { leadCreatedData } from '_mock/leadCreatedData';
// import { modalType } from '_mock/defines';
// import { PlainText } from '../../../utils/typography';

// const style = {
//   position: 'absolute',
//   top: '50%',
//   left: '50%',
//   transform: 'translate(-50%, -50%)',
//   maxWidth: 786,
//   width: '100%',
//   bgcolor: 'background.paper',
//   boxShadow: 24,
//   borderRadius: 2,
//   p: '30px',
// };

// const EmailView = ({ isOpen, setOpenModal, onSubmit, onClose }) => (
//   <Modal open={isOpen} onClose={onClose}>
//     <Box sx={style}>
//       <Stack direction="row" alignItems="center" mb="10px">
//         <img src="/assets/icons/eye.svg" alt="" style={{ marginRight: '0.5rem', height: '34px', width: '34px' }} />
//         <Typography variant="h4">Email preview</Typography>
//       </Stack>
//       <Typography sx={{ py: 1, borderBottom: '1px solid rgba(185, 190, 199, 0.6)' }}>
//         <span style={{ color: '#7C828D', paddingRight: '0.8rem' }}>Send to:</span> derek@growtoro.com
//       </Typography>
//       <Typography sx={{ py: 1 }}>
//         <span style={{ color: '#7C828D', paddingRight: '0.8rem' }}>Subject:</span> Lead Generation Growtoro
//       </Typography>
//       <TextField
//         placeholder={`Hello {{First Name}},

// I was just wondering if you received the email I sent you. I was very much looking forward to hearing from you!

// Waiting for your positive response`}
//         multiline
//         minRows={10}
//         sx={{ width: '100%', backgroundColor: '#F9FAFE', my: 2 }}
//       />
//       <Box sx={{ textAlign: 'end' }}>
//         <Button variant="contained" onClick={() => setOpenModal('')} sx={{ my: '0.5rem' }}>
//           <img src="/assets/icons/send2.svg" alt="" style={{ marginRight: '0.5rem' }} /> Send test email to me
//         </Button>
//       </Box>
//     </Box>
//   </Modal>
// );

// export default EmailView;
