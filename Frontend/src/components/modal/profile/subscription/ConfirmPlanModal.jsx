import { Button, Divider } from '@mui/material';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Typography from '@mui/material/Typography';
import { Stack } from '@mui/system';
import ModalsHeader from 'components/modal/emails/ModalsHeader';
import { useUser } from 'context/UserContext';
import { Link } from 'react-router-dom';
import { APPLICATION_URL } from 'utils/constant';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '40%',
  bgcolor: 'background.paper',
  boxShadow: 24,
  borderRadius: '10px',
  textAlign: 'center',
};

const ConfirmPlanModal = ({ data }) => {
  const { user } = useUser();

  return (
    data.open && (
      <Modal
        open={data.open}
        onClose={data.handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <ModalsHeader title="Confirm Plan Changes" handleClose={data.handleClose} />

          <Divider />

          <Stack my={2}>
            <Typography>
              You are about to change your subscription to{' '}
              <span style={{ fontWeight: 'bold' }}>{data.plan.plan_name}</span>.
            </Typography>
            <Typography>This will cost you ${data.plan.plan_amount} per month.</Typography>
          </Stack>
          <Box my={4} width="60%" mx={'auto'} display="flex" justifyContent={'space-around'} gap={1}>
            <Button fullWidth onClick={() => data.handleClose()} variant="outlined">
              Cancel
            </Button>
            <Button
              component={Link}
              fullWidth
              // target="blank"
              to={`${APPLICATION_URL}create-session/${user.tenant_id}/${data.plan.stripe_plan_id}`}
              onClick={() => data.handlePurchase()}
              variant="contained"
            >
              UPGRADE PLAN
            </Button>
          </Box>
        </Box>
      </Modal>
    )
  );
};

export default ConfirmPlanModal;
