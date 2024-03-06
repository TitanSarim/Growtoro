import Calendar from 'react-calendar';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
// import { useState } from 'react';
import moment from 'moment-timezone';

export default ({ onChange, dates }) => {
  const isDateDisabled = ({ date }) => {
    const today = new Date();
    return (
      date.getFullYear() < today.getFullYear() ||
      (date.getFullYear() === today.getFullYear() && date.getMonth() < today.getMonth()) ||
      (date.getFullYear() === today.getFullYear() &&
        date.getMonth() === today.getMonth() &&
        date.getDate() < today.getDate())
    );
  };

  const handleDateChange = (value) => {
    // const year = value.getFullYear();
    // const month = String(value.getMonth() + 1).padStart(2, '0');
    // const day = String(value.getDate()).padStart(2, '0');
    // const formattedDate = `${year}-${month}-${day}`;
    onChange(value);
  };

  return (
    <Calendar
      value={moment(dates).toDate()}
      onChange={handleDateChange}
      tileDisabled={isDateDisabled}
      nextLabel={<ArrowForwardIosIcon fontSize="16px" />}
      prevLabel={<ArrowBackIosIcon fontSize="16px" />}
      prev2Label={false}
      next2Label={false}
      style={{ borderWidth: 'none' }}
    />
  );
};
