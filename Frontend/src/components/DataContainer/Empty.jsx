import { Stack } from '@mui/material';
import { PlainText } from 'utils/typography';

const Empty = ({ img, message, action }) => (
  <Stack direction="column" alignItems="center" justifyContent="center" mt={10}>
    <img src={img} alt={message} style={{ maxWidth: '400px', maxHeight: '280px' }} />
    <PlainText width="430px" margin="30px auto">
      {message}
    </PlainText>
    {action}
  </Stack>
);

export default Empty;
