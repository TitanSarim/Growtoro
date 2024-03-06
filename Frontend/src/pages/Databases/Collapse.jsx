import * as React from 'react';
import { styled } from '@mui/material/styles';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { AiFillCaretDown } from 'react-icons/ai';
import { Divider, TextField } from '@mui/material';

export const ExpandMore = styled((props) => {
  const { ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
  marginLeft: 'auto',
  transition: theme.transitions.create('transform', {
    duration: theme.transitions.duration.shortest,
  }),
}));

export function CollapseBar({ icons, name, expanded, setExpanded }) {
  const handleExpandClick = () => {
    setExpanded(!expanded);
  };
  return (
    <>
      <CardActions disableSpacing onClick={handleExpandClick}>
        <IconButton aria-label="add to favorites">{icons}</IconButton>
        <Typography sx={{ overflow: 'hidden', whiteSpace: 'nowrap' }}>{name}</Typography>
        <ExpandMore expand={expanded} aria-expanded={expanded} aria-label="show more">
          <AiFillCaretDown fontSize="inherit" color="#A69D9D" />
        </ExpandMore>
        <Divider />
      </CardActions>
      <Divider />
    </>
  );
}

export default function CollapseMenu({ icons, name, lable, expanded, setExpanded }) {
  return (
    <>
      <CollapseBar icons={icons} name={name} expanded={expanded} setExpanded={setExpanded} />
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardContent sx={{ background: 'rgba(185, 190, 199, 0.2)', borderRadius: '5px' }}>
          <Typography sx={{ fontSize: '14px' }}>{lable}</Typography>
          <TextField
            sx={{ background: '#FFFFFF', border: '1px solid rgba(185, 190, 199, 0.6)', borderRadius: '5px', mt: '5px' }}
            placeholder={`Enter ${name}`}
          />
        </CardContent>
      </Collapse>
    </>
  );
}
