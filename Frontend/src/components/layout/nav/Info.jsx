import { useState } from 'react';
import { alpha } from '@mui/material/styles';
import { IconButton } from '@mui/material';
import InfoModal from 'components/modal/Info';

const noti = [
  {
    label: 'info',
    icon: '/assets/icons/ic_infopopover.svg',
  },
];

export default function Info() {
  const [openModal, setOpenModal] = useState('');
  // eslint-disable-next-line no-unused-vars
  const [open, setOpen] = useState(null);

  const handleOpen = () => {
    setOpenModal('info');
  };

  return (
    <>
      <IconButton
        onClick={handleOpen}
        sx={{
          padding: 0,
          width: 24,
          height: 24,
          ...(open && {
            bgcolor: (theme) => alpha(theme.palette.primary.main, theme.palette.action.focusOpacity),
          }),
        }}
      >
        <img src={noti[0].icon} alt={noti[0].label} />
      </IconButton>
      <InfoModal
        isOpen={openModal === 'info'}
        setOpenModal={setOpenModal}
        onSubmit={() => {}}
        onClose={() => setOpenModal('')}
      />
    </>
  );
}
