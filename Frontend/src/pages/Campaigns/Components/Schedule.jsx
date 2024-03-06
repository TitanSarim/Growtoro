import {
  Box,
  Button,
  Card,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Grid,
  MenuItem,
  Select,
  Typography,
} from '@mui/material';
import { timeSlot } from '_mock/timesSlot';
import { timezone } from '_mock/timezone';
import Calender from 'components/Calender';
import { useCampaign } from 'context/CampaignContext';
import { useNotification } from 'context/NotificationContext';
import moment from 'moment-timezone';
import { useEffect, useState } from 'react';
// import { useLocation } from 'react-router-dom';

export default () => {
  const formattedDate = moment().format('ddd MMM DD YYYY HH:mm:ss');
  const { onNewCampaignInputChange, newCampaign, setNewCampaignTab } = useCampaign();
  const [date, setDate] = useState(newCampaign?.time_filter?.start_date || formattedDate);
  // const [editDate, setEditDate] = useState(newCampaign?.time_filter?.start_date || new Date());
  const { sendNotification } = useNotification();
  // const location = useLocation();
  const [selectedDays, setSelectedDays] = useState({});
  const [startValue, setStartValue] = useState(newCampaign?.time_filter?.start_at || '12:00');
  const [stopValue, setStopValue] = useState(newCampaign?.time_filter?.stop_at || '19:00');
  const [timeValue, setTimeValue] = useState(newCampaign?.time_filter?.time_zone || 'US/Eastern');

  const handleDaysChange = (name, value) => {
    setSelectedDays((prev) => ({ ...prev, [name]: value }));
  };

  const handleStartAt = (value) => {
    setStartValue(value);
  };

  const handleEndAt = (value) => {
    setStopValue(value);
  };

  const handleTimeZone = (value) => {
    setTimeValue(value);
  };

  const handleClick = () => {
    onNewCampaignInputChange((prev) => ({
      ...prev,
      time_filter: {
        ...prev.time_filter,
        start_at: startValue,
        stop_at: stopValue,
        time_zone: timeValue,
      },
    }));

    onNewCampaignInputChange((prev) => ({
      ...prev,
      time_filter: {
        ...prev.time_filter,
        start_date: moment(date).format('YYYY-MM-DD'),
      },
    }));

    // selected days
    const _selectedDays = [];

    Object.entries(selectedDays).forEach((item) => {
      if (item[1]) {
        _selectedDays.push(item[0]);
      }
    });

    onNewCampaignInputChange((prev) => ({
      ...prev,
      time_filter: {
        ...prev.time_filter,
        days: _selectedDays.join(','),
      },
    }));
    const validationErrors = {};
    if (timeValue === 'Select') {
      validationErrors.time_zone = 'Time zone is required';
      sendNotification({
        open: true,
        message: validationErrors.time_zone,
        alert: 'error',
      });
    }
    if (Object.keys(selectedDays).length === 0) {
      validationErrors.days = 'Days is required';
      sendNotification({
        open: true,
        message: validationErrors.days,
        alert: 'error',
      });
    }

    if (Object.keys(validationErrors).length === 0) {
      setNewCampaignTab('Settings');
      sendNotification({
        open: true,
        message: 'Schedule Saved',
        alert: 'success',
      });
    }
  };

  // find the selected days
  useEffect(() => {
    let _sDays = {};
    if (newCampaign?.time_filter?.days) {
      const campaginSelectedDays = newCampaign?.time_filter?.days.split(',') ?? [];
      campaginSelectedDays.forEach((_day) => {
        _sDays = { ..._sDays, [_day]: true };
      });
    } else {
      for (let i = 0; i < 5; i += 1) {
        _sDays = { ..._sDays, [i]: true };
      }
    }
    setSelectedDays(_sDays);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // const path = location.pathname;
  // const lastPart = path.substring(path.lastIndexOf('/') + 1);

  return (
    <Grid container sx={{ justifyContent: 'center', marginTop: 1 }}>
      <Grid item xs={12} lg={7}>
        <Card sx={{ padding: 2, height: '73vh', mb: '0.5vh', overflow: 'auto' }}>
          <Typography variant="h6" sx={{ padding: 1, textAlign: 'center' }}>
            When do you want to send this campaign?
          </Typography>

          <Typography variant="h5" sx={{ padding: 2, textAlign: 'center' }}>
            At what time?
          </Typography>
          <Grid container>
            <Grid item xs={5}>
              {date && <Calender onChange={setDate} dates={date} />}
              {/* {date && <Calender onChange={setDate} dates={lastPart === 'edit' ? editDate : date} />} */}
            </Grid>
            <Grid item xs={6}>
              <Grid container spacing={2} sx={{ pt: 2, ml: 3 }}>
                <Grid item xs={6}>
                  <div>Start Time</div>
                  <Select
                    // defaultValue={selectedValue}
                    value={startValue}
                    sx={{ width: '100%' }}
                  >
                    {Object.keys(timeSlot).map((time, index) => (
                      <MenuItem key={index} value={time} onClick={() => handleStartAt(time)}>
                        {timeSlot[time]}
                      </MenuItem>
                    ))}
                  </Select>
                </Grid>
                <Grid item xs={6} sx={{ mb: 2 }}>
                  <div>End Time</div>
                  <Select
                    // defaultValue={newCampaign?.time_filter?.stop_at ?? '06:30'}
                    value={stopValue}
                    sx={{ width: '100%' }}
                  >
                    {Object.keys(timeSlot).map((time, index) => (
                      <MenuItem key={index} value={time} onClick={() => handleEndAt(time)}>
                        {timeSlot[time]}
                      </MenuItem>
                    ))}
                  </Select>
                </Grid>
                <Grid item xs={12}>
                  <div>Time Zone</div>
                  <Select
                    // defaultValue={newCampaign?.time_filter?.time_zone ?? 'Select'}
                    value={timeValue}
                    sx={{ width: '100%' }}
                  >
                    <MenuItem value={'Select'}>Select</MenuItem>
                    {Object.keys(timezone).map((_timezone) => (
                      <MenuItem key={_timezone} value={_timezone} onClick={() => handleTimeZone(_timezone)}>
                        {timezone[_timezone]}
                      </MenuItem>
                    ))}
                  </Select>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="h5" sx={{ pt: 1, textAlign: 'center' }}>
                    Days
                  </Typography>
                  <Box sx={{ paddingY: 0.1, display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                    <FormGroup>
                      <FormControlLabel
                        control={
                          <Checkbox
                            value="0"
                            checked={selectedDays['0'] ?? false}
                            onChange={(e) => handleDaysChange('0', e.target.checked)}
                          />
                        }
                        label="Monday"
                      />
                    </FormGroup>
                    <FormGroup>
                      <FormControlLabel
                        control={
                          <Checkbox
                            value="1"
                            checked={selectedDays['1'] ?? false}
                            onChange={(e) => handleDaysChange('1', e.target.checked)}
                          />
                        }
                        label="Tuesday"
                      />
                    </FormGroup>
                    <FormGroup>
                      <FormControlLabel
                        control={
                          <Checkbox
                            value="2"
                            checked={selectedDays['2'] ?? false}
                            onChange={(e) => handleDaysChange('2', e.target.checked)}
                          />
                        }
                        label="Wednesday"
                      />
                    </FormGroup>
                    <FormGroup>
                      <FormControlLabel
                        control={
                          <Checkbox
                            value="3"
                            checked={selectedDays['3'] ?? false}
                            onChange={(e) => handleDaysChange('3', e.target.checked)}
                          />
                        }
                        label="Thursday"
                      />
                    </FormGroup>
                    <FormGroup>
                      <FormControlLabel
                        control={
                          <Checkbox
                            value="4"
                            checked={selectedDays['4'] ?? false}
                            onChange={(e) => handleDaysChange('4', e.target.checked)}
                          />
                        }
                        label="Friday"
                      />
                    </FormGroup>
                    <FormGroup>
                      <FormControlLabel
                        control={
                          <Checkbox
                            value="5"
                            checked={selectedDays['5'] ?? false}
                            onChange={(e) => handleDaysChange('5', e.target.checked)}
                          />
                        }
                        label="Saturday"
                      />
                    </FormGroup>
                    <FormGroup>
                      <FormControlLabel
                        control={
                          <Checkbox
                            value="6"
                            checked={selectedDays['6'] ?? false}
                            onChange={(e) => handleDaysChange('6', e.target.checked)}
                          />
                        }
                        label="Sunday"
                      />
                    </FormGroup>
                  </Box>
                </Grid>
              </Grid>
            </Grid>
          </Grid>

          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button variant="contained" onClick={handleClick}>
              SAVE SCHEDULE
            </Button>
          </Box>
        </Card>
      </Grid>
    </Grid>
  );
};
