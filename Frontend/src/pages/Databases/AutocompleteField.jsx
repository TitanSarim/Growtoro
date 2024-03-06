import React from 'react';
// import { HeaderTitle } from 'utils/typography';
import { Autocomplete, CardContent, Collapse, TextField, Typography } from '@mui/material';

const options = [{ label: 'one' }, { label: 'two' }, { label: 'three' }];

const AutocompleteField = (props) => {
  const { label, expanded, placeHolder } = props;
  return (
    <>
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardContent sx={{ borderRadius: '5px', padding: '0 !important' }}>
          <Typography sx={{ fontSize: '14px', mb: 0.5, mt: 1.5 }}>{label}</Typography>
          <Autocomplete
            sx={{ background: '#ffff' }}
            disablePortal
            id="combo-box-demo"
            options={options}
            renderInput={(params) => <TextField {...params} label={placeHolder} />}
          />
        </CardContent>
      </Collapse>
    </>
  );
};

export default AutocompleteField;
