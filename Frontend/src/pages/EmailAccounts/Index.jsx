import { useState } from 'react';
import { Box, Button, Checkbox, Menu, MenuItem, Stack } from '@mui/material';
import { alpha, styled } from '@mui/material/styles';
import TuneIcon from '@mui/icons-material/Tune';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

import { modalType } from '_mock/defines';
import { useEmail } from 'context/EmailContext';
import { AddButton } from 'components/button/buttons';
import { HeaderTitle } from 'utils/typography';
import Loading from 'components/Loading';

import DataContainer from 'components/DataContainer';
import SearchInput from 'components/input/SearchInput';
import AddEmailModals from 'components/modal/emails/AddEmailModals';
import AddModalsForms from 'components/modal/emails/AddModalsForms';
import AddEmailPermission from 'components/modal/emails/AddEmailPermission';
import DataTable from './DataTable';

export const StyledMenu = styled((props) => <Menu elevation={0} {...props} />)(({ theme }) => ({
  '& .MuiPaper-root': {
    borderRadius: 6,
    marginTop: theme.spacing(1),
    minWidth: 180,
    color: theme.palette.mode === 'light' ? 'rgb(55, 65, 81)' : theme.palette.grey[300],
    boxShadow:
      'rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px',
    '& .MuiMenu-list': {
      padding: '4px 0',
    },
    '& .MuiMenuItem-root': {
      '& .MuiSvgIcon-root': {
        fontSize: 18,
        color: theme.palette.text.secondary,
        marginRight: theme.spacing(1.5),
      },
      '&:active': {
        backgroundColor: alpha(theme.palette.primary.main, theme.palette.action.selectedOpacity),
      },
    },
  },
}));

export default function EmailPages() {
  const { emails, setEditAble, isLoading, emailNumber } = useEmail();

  const [openModal, setOpenModal] = useState('');
  const [check1, setCheck1] = useState(false);
  const [check2, setCheck2] = useState(false);
  const [isSearch, setIsSearch] = useState(false);
  const [data, setData] = useState();
  const [searchData, setSearchData] = useState([]);
  const [searchInput, setSearchInput] = useState('');
  const [emailLimit, setEmailLimit] = useState(0);

  const closeModal = () => {
    setOpenModal(modalType.Close);
    setEditAble();
  };
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const activeEmails = () => {
    setCheck1(!check1);
    if (!check1) {
      setCheck2(false);
      const data = emails.filter((email) => email.status === 1);
      setData(data);
    }
  };

  const deactiveEmails = () => {
    setCheck2(!check2);
    if (!check2) {
      setCheck1(false);
      const data = emails.filter((email) => email.status === 0);
      setData(data);
    }
  };

  const searchEmail = (e) => {
    setSearchInput(e);
    if (e.length > 0) {
      setIsSearch(true);
      let matchedObjects = emails.filter((obj) => obj.smtp_from_email.slice(0, e.length) === e);
      if (check1 || check2) {
        matchedObjects = data.filter((obj) => obj.smtp_from_email.slice(0, e.length) === e);
      }
      setSearchData(matchedObjects);
    } else {
      setIsSearch(false);
    }
  };

  const handleAddEmail = () => {
    const _limit = emailNumber.limit ? emailNumber.limit : 10;
    if (_limit > emailNumber.total_rows || _limit === -1) setOpenModal(modalType.SelectType);
    else setOpenModal(modalType.Permission);

    // setOpenModal(modalType.SelectType);
  };

  if (isLoading)
    return (
      <Box sx={{ width: '100%', height: '150%', display: 'flex' }}>
        <Loading />
      </Box>
    );

  return (
    <>
      <HeaderTitle> Email Accounts</HeaderTitle>
      <>
        <Stack
          direction={{ xs: 'column', md: 'row' }}
          alignItems={{ xs: 'start', md: 'center' }}
          justifyContent="space-between"
        >
          <Stack direction="row" alignItems="center" spacing={1}>
            <Button
              aria-haspopup="true"
              aria-expanded={open ? 'true' : undefined}
              disableElevation
              size="small"
              sx={{
                color: '#333333',
                border: '1px solid rgba(185, 190, 199, 0.6)',
                fontSize: '14px',
                fontWeight: 400,
                background: '#FFFFFF',
                borderRadius: '5px',
              }}
              onClick={handleClick}
              endIcon={<KeyboardArrowDownIcon />}
            >
              <TuneIcon sx={{ marginRight: '0.5rem', color: '#7B68EE' }} /> {'Filter'}
            </Button>

            <StyledMenu anchorEl={anchorEl} open={open} onClose={handleClose}>
              <MenuItem onClick={handleClose}>
                <Checkbox disableRipple checked={check1} onClick={activeEmails} />
                Activated
              </MenuItem>
              <MenuItem onClick={handleClose}>
                <Checkbox disableRipple checked={check2} onClick={deactiveEmails} />
                Deactivated
              </MenuItem>
            </StyledMenu>
          </Stack>
          <Stack direction="row" alignItems="center">
            <SearchInput value={searchInput} onChange={(e) => searchEmail(e)} />
            <AddButton onClick={handleAddEmail} />
          </Stack>
        </Stack>

        <Stack direction="column" alignItems="center" justifyContent="center">
          {isSearch ? (
            <DataContainer
              errorImg={'/assets/images/Avaterimage.png'}
              errorMessage="Please link your email account to get started"
              errorLink={<AddButton onClick={() => setOpenModal(modalType.SelectType)} />}
              data={searchData}
            >
              <DataTable rows={searchData} className="dev" />
            </DataContainer>
          ) : (
            <DataContainer
              errorImg={'/assets/images/Avaterimage.png'}
              errorMessage="Please link your email account to get started"
              errorLink={<AddButton onClick={() => setOpenModal(modalType.SelectType)} />}
              data={check1 || check2 ? data : emails}
            >
              <DataTable rows={check1 || check2 ? data : emails} />
            </DataContainer>
          )}

          <AddEmailModals
            isOpen={openModal === modalType.SelectType}
            onClose={() => setOpenModal(modalType.Close)}
            onSubmit={() => setOpenModal(modalType.ConnectSMTP)}
          />

          <AddEmailPermission
            // isOpen={openModal === modalType.Permission}
            isOpen={openModal === modalType.Permission}
            onClose={() => setOpenModal(modalType.Close)}
            onSubmit={() => {}}
            emailNumber={emailLimit}
          />

          <AddModalsForms
            isOpen={openModal === modalType.ConnectSMTP}
            setOpenModal={setOpenModal}
            onClose={closeModal}
            onBack={() => setOpenModal(modalType.SelectType)}
            onSubmit={(data) => {
              setEmailLimit(data?.email_limit);
              // if (limit.permission === 0) setOpenModal(modalType.Permission);
              setOpenModal(modalType.Close);
            }}
            header="Let's add a new email account"
          />
        </Stack>
      </>
    </>
  );
}
