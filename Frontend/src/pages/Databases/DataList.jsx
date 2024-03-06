import React from 'react';
import { Box, Button,Typography } from '@mui/material';
// import CheckCircleIcon from '@mui/icons-material/CheckCircle';
// import CheckAll from 'components/filter/CheckAll';
import SearchInput from 'components/input/SearchInput';
import { AddButton } from 'components/button/buttons';
// import DatabaseTable from 'components/tables/DatabaseTable';
import AddIcon from '@mui/icons-material/Add';
import SendIcon from '@mui/icons-material/Send';
import { BsDownload } from 'react-icons/bs';
import SequenceDropdown from 'pages/Databases/SequenceDropdown';
import ListsDropdown from 'pages/Databases/ListsDropdown';
import MenuOpenTwoToneIcon from '@mui/icons-material/MenuOpenTwoTone';
import DatabaseTable2 from 'components/tables/DatabaseTable2';

const DataList = (props) => {
  const { handleOpen, setExports, campaigns, height, numOfRow, dash, setDash } = props;
  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', height: 35, mb: '1vh' }}>
        <Box sx={{ display: 'flex', gap: 1.5 }}>
          <Button
            variant={dash ? 'contained' : 'outlined'}
            startIcon={<MenuOpenTwoToneIcon />}
            sx={{
              minWidth: '40px !important',
              ml: 1,
            }}
            onClick={() => setDash(!dash)}
          />
          <Button
            variant="contained"
            sx={{ minWidth: '6rem !important' }}
            size="medium"
            // startIcon={<AddIcon sx={{ mr: 0 }} />}
            onClick={handleOpen}
            disableRipple
            disableFocusRipple
          >
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <AddIcon />
              <Typography variant="body2" fontWeight="bold">
                SAVE
              </Typography>
            </Box>
            {/* SAVE sx={{ fontWeight: '400', fontFamily: 'Inter' */}
          </Button>
          <SequenceDropdown label="Sequence" leftIcon={<SendIcon sx={{ color: '#4896FF', mr: 1, fontSize: 25 }} />} />
          <ListsDropdown />
          <Button
            size="medium"
            sx={{
              color: '#333333',
              border: '2px solid #E9EBF0',
              minWidth: '6rem !important',
            }}
            disableRipple
            disableFocusRipple
            onClick={() => setExports(true)}
          >
            <BsDownload color="#FFBC01" size={20} style={{ marginRight: '8px' }} />
            <Typography variant="body2" fontWeight="bold">
              Export
            </Typography>
          </Button>
        </Box>
        <Box sx={{ display: 'flex', gap: '0.5rem' }}>
          <SearchInput sx={{ py: '0rem !important', pr: '0rem !important' }} />
          <AddButton onClick={() => {}} text="IMPORT" sx={{ minWidth: '7rem !important', py: '0rem !important' }} />
        </Box>
      </Box>
      {/* <DatabaseTable rows={campaigns} /> */}
      <DatabaseTable2 rows={campaigns} height={height} numOfRow={numOfRow} />
    </Box>
  );
};

export default DataList;
