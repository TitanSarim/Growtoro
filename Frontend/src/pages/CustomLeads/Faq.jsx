import * as React from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Typography from '@mui/material/Typography';
import ControlPointIcon from '@mui/icons-material/ControlPoint';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import { Box, Divider } from '@mui/material';

export default function FaqQuestions(props) {
  const [toggle, setToggle] = React.useState(false);
  const [expanded, setExpanded] = React.useState();

  const handleChange = (id) => {
    setExpanded(id);
  };

  return (
    <Box>
      {props.accordData?.map((data) => (
        <Accordion
          key={data.id}
          expanded={expanded === data.id && toggle}
          onChange={() => {
            handleChange(data.id);
            setToggle(!toggle);
          }}
          sx={{
            backgroundColor: '#F9FAFE',
            mt: 1,
            '&:before': {
              display: 'none',
            },
          }}
        >
          <AccordionSummary
            expandIcon={
              expanded === data.id && toggle ? (
                <RemoveCircleOutlineIcon sx={{ color: '#7B68EE' }} />
              ) : (
                <ControlPointIcon sx={{ color: '#7B68EE' }} />
              )
            }
          >
            <Typography>{data.title}</Typography>
          </AccordionSummary>
          <Divider />
          <AccordionDetails>
            {/* <Typography
              sx={{
                fontFamily: 'Inter',
                fontStyle: 'normal',
                fontWeight: 400,
                fontSize: '14px',
                lineHeight: '19px',
              }}
              dangerouslySetInnerHTML={{ __html: parseHTML(data.description) }}
            /> */}
            <Typography
              sx={{
                fontFamily: 'Inter',
                fontStyle: 'normal',
                fontWeight: 400,
                fontSize: '14px',
                lineHeight: '19px',
                whiteSpace: 'pre-wrap', // or ''
              }}
            >
              {/* eslint-disable-next-line react/no-danger */}
              <p dangerouslySetInnerHTML={{ __html: data.description }} />
            </Typography>
          </AccordionDetails>
        </Accordion>
      ))}
    </Box>
  );
}
