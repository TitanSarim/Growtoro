import { Box } from '@mui/material';

function DynamicInput({ label, placeholder, type, value, name, updateData }) {
  return (
    <Box style={{ display: 'flex', flexDirection: 'column', alignItems: 'start' }}>
      <label
        style={{
          fontFamily: 'Inter',
          fontStyle: 'normal',
          fontWeight: 400,
          fontSize: '20px',
          lineHeight: '17px',
          color: '#333333',
          margin: '9px 4px',
        }}
      >
        {label}
      </label>
      <input
        placeholder={placeholder}
        type={type}
        name={name}
        value={value}
        onChange={updateData}
        style={{
          fontSize: '18px',
          backgroundColor: 'white',
          padding: '12px',
          border: '1px solid #B9BEC7',
          width: '100%',
          borderRadius: '5px',
        }}
      />
    </Box>
  );
}

export default DynamicInput;
