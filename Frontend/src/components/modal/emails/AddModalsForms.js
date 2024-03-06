import * as React from 'react';
import Box from '@mui/material/Box';
// import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { Grid } from '@mui/material';
import Forms from './Forms';
import ModalsHeader from './ModalsHeader';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  bgcolor: 'background.paper',
  boxShadow: 24,
  borderRadius: 2,
  height: '95%',
  maxHeight: 885,
  width: '100%',
  maxWidth: 700,
  overflow: 'auto',
  display: 'block',
};

export default function AddModalsForms({ isOpen, onClose, onBack, onSubmit, header, setOpenModal }) {
  return (
    <Modal open={isOpen} onClose={onClose}>
      <Box sx={style}>
        <ModalsHeader title={header} handleClose={onClose} />

        <Grid container spacing={2} p="25px 32px">
          <Grid item xs={12}>
            <Forms onClose={onClose} onBack={onBack} onSubmit={onSubmit} setOpenModal={setOpenModal} />
          </Grid>
          {/* <Grid item xs={5}>
            <Content />
          </Grid> */}
        </Grid>
      </Box>
    </Modal>
  );
}

// function Content() {
//   return (
//     <Stack
//       direction="column"
//       sx={{
//         background: '#F9FAFE',
//         borderRadius: '10px',
//         p: 3,
//         color: '#333333',
//       }}
//       spacing={2}
//     >
//       <Typography
//         variant="body1"
//         sx={{
//           fontFamily: 'Inter',
//           fontStyle: 'normal',
//           fontWeight: 700,
//           fontSize: '16px',
//           lineHeight: '19px',
//         }}
//       >
//         Tips to successfully connect your email account:
//       </Typography>
//       <Stack direction="column" spacing={1}>
//         <Typography
//           variant="body1"
//           sx={{
//             fontFamily: 'Inter',
//             fontStyle: 'normal',
//             fontWeight: 700,
//             fontSize: '16px',
//             lineHeight: '19px',
//           }}
//         >
//           IMAP:
//         </Typography>
//         <Box
//           sx={{
//             px: 2.5,
//             fontFamily: 'Inter',
//             fontStyle: 'normal',
//             fontWeight: 400,
//             fontSize: '14px',
//             lineHeight: '17px',
//           }}
//         >
//           <ul>
//             <li>Ensure your email account is enabled for IMAP.</li>
//             <li>Ensure you use your email account credentials for IMAP connection.</li>
//           </ul>
//         </Box>
//       </Stack>
//       <Stack direction="column" spacing={1}>
//         <Typography
//           variant="body1"
//           sx={{
//             fontFamily: 'Inter',
//             fontStyle: 'normal',
//             fontWeight: 700,
//             fontSize: '16px',
//             lineHeight: '19px',
//           }}
//         >
//           SMTP:
//         </Typography>
//         <Box
//           sx={{
//             px: 2.5,
//             fontFamily: 'Inter',
//             fontStyle: 'normal',
//             fontWeight: 400,
//             fontSize: '14px',
//             lineHeight: '17px',
//           }}
//         >
//           <ul>
//             <li>Ensure your email account is enabled for SMTP.</li>
//             <li>Ensure that 2FA is not enabled on your email account.</li>
//             <li>If 2FA is enabled, please use app-password instead of email password.</li>
//           </ul>
//         </Box>
//       </Stack>
//     </Stack>
//   );
// }
