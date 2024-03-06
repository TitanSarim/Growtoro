import { MenuItem, Select } from '@mui/material';
import { useCampaign } from 'context/CampaignContext';
// import { useEmail } from 'context/EmailContext';
import React, { useState } from 'react';

function DynamicDropdown({ name, onChangeHandler, selectItems = [] }) {
  const { newCampaign } = useCampaign();
  const [selectedValue, setSelectedValue] = useState(newCampaign?.smtp_id || 0);

  const handleChange = (event) => {
    setSelectedValue(event.target.value);
  };

  return (
    <Select
      value={selectedValue}
      name={name}
      onChange={(e) => {
        onChangeHandler(e);
        handleChange(e);
      }}
      sx={{ width: '100%', background: '#FFFFFF', border: '1px solid rgba(185, 190, 199, 0.6)', borderRadius: '5px' }}
    >
      <MenuItem value={'0'}>Select your {name}</MenuItem>
      {selectItems?.map((item, index) => (
        <MenuItem key={index} value={item.id}>
          {item.value}
        </MenuItem>
      ))}
    </Select>
  );
}

export default DynamicDropdown;
