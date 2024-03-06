import { Box, Grid, LinearProgress, Typography, Tooltip } from '@mui/material';
import { useCampaign } from 'context/CampaignContext';
import { GoInfo } from "react-icons/go";
import IconButton from '@mui/material/IconButton';

import ApexChart from './ApexChart';

export default () => {
  const { newCampaign } = useCampaign();

  return (
    <Grid container sx={{ padding: 2, margin: 1 }}>
      <Grid item xs={4}>
        {/* opened */}
        <Grid container sx={{ marginTop: '1rem' }}>
          <Grid item xs={2}>
            <div style={{ background: '#85CCFF', display: 'inline-block', padding: '1rem', borderRadius: '1rem' }}>
              <img src="/assets/icons/eye-contained.svg" alt="" />
            </div>
          </Grid>

          <Grid item xs={8} sx={{ marginLeft: '10px' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <div>
                <div>
                Opened
                  <Tooltip title="Unique number of leads that have opened an email on this campaign." arrow>
                    <IconButton>
                      <GoInfo />
                    </IconButton>
                  </Tooltip>
                </div>
                <Typography variant="h5">{newCampaign?.opened_percentage || 0}%</Typography>
              </div>
              <div style={{ display: 'flex', alignItems: 'end' }}>
                <div style={{ color: '#7C828D', textAlign: 'end' }}>
                  {newCampaign?.opened_recipients || 0} recipients
                </div>
              </div>
            </Box>
            <LinearProgress variant="determinate" value={0} />
          </Grid>
        </Grid>

        {/* replied */}
        <Grid container sx={{ marginTop: '1rem' }}>
          <Grid item xs={2}>
            <div style={{ background: '#FFF2CC', display: 'inline-block', padding: '1rem', borderRadius: '1rem' }}>
              <img src="/assets/icons/chat-contained.svg" alt="" />
            </div>
          </Grid>
          <Grid item xs={8} sx={{ marginLeft: '10px' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <div>
                <div>
                  Replied
                  <Tooltip title="Unique number of leads that have replied to an email on this campaign." arrow>
                    <IconButton>
                      <GoInfo />
                    </IconButton>
                  </Tooltip>
                </div>
                <Typography variant="h5">{newCampaign?.replied_percentage || 0}%</Typography>
              </div>
              <div style={{ display: 'flex', alignItems: 'end' }}>
                <div style={{ color: '#7C828D', textAlign: 'end' }}>
                  {newCampaign?.reply_recipients || 0} recipients
                </div>
              </div>
            </Box>
            <LinearProgress variant="determinate" value={0} />
          </Grid>
        </Grid>

        {/* clicked */}
        <Grid container sx={{ marginTop: '1rem' }}>
          <Grid item xs={2}>
            <div
              style={{
                background: 'rgba(249, 75, 75, 0.2)',
                display: 'inline-block',
                padding: '1rem',
                borderRadius: '1rem',
              }}
            >
              <img src="/assets/icons/clicked-contained.svg" alt="" />
            </div>
          </Grid>
          <Grid item xs={8} sx={{ marginLeft: '10px' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <div>
                <div>
                  Clicked
                  <Tooltip title="Unique number of leads that have clicked at least one link on this campaign." arrow>
                    <IconButton>
                      <GoInfo />
                    </IconButton>
                  </Tooltip>
                </div>
                <Typography variant="h5">{newCampaign?.clicked_percentage || 0}%</Typography>
              </div>
              <div>
                <div style={{ color: 'red' }}>&nbsp;</div>
                <div style={{ color: '#7C828D', textAlign: 'end' }}>
                  {newCampaign?.click_recipients || 0} recipients
                </div>
              </div>
            </Box>
            <LinearProgress variant="determinate" value={0} />
          </Grid>
        </Grid>

        {/* unsubscribed */}
        <Grid container sx={{ marginTop: '1rem' }}>
          <Grid item xs={2}>
            <div style={{ background: '#FFE3EF', display: 'inline-block', padding: '1rem', borderRadius: '1rem' }}>
              <img src="/assets/icons/heart-contained.svg" alt="" />
            </div>
          </Grid>
          <Grid item xs={8} sx={{ marginLeft: '10px' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <div>
                <div>Unsubscribed</div>
                <Typography variant="h5">{newCampaign?.unsubscribed_percentage || 0}%</Typography>
              </div>
              <div style={{ display: 'flex', alignItems: 'end' }}>
                <div style={{ color: '#7C828D', textAlign: 'end' }}>
                  {newCampaign?.unsubscribe_recipients || 0} recipients
                </div>
              </div>
            </Box>
            <LinearProgress variant="determinate" value={0} />
          </Grid>
        </Grid>

        {/* unique contacted */}
        {/* <Grid container sx={{ marginTop: '1rem' }}>
          <Grid item xs={2}>
            <div style={{ background: '#CCF1E6', display: 'inline-block', padding: '1rem', borderRadius: '1rem' }}>
              <img src="/assets/icons/message-contained.svg" alt="" />
            </div>
          </Grid>
          <Grid item xs={8}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <div>
                <div>Unique Contacted</div>
                <Typography variant="h5">{newCampaign?.contacted_percentage || 0}%</Typography>
              </div>
              <div>
                <div style={{ color: 'red' }}>&nbsp;</div>
                <div style={{ color: '#7C828D', textAlign: 'end' }}>
                  {newCampaign?.contacts_recipients || 0} recipients
                </div>
              </div>
            </Box>
            <LinearProgress variant="determinate" value={0} />
          </Grid>
        </Grid> */}

        {/* total contracted */}
        <Grid container sx={{ marginTop: '1rem' }}>
          <Grid item xs={2}>
            <div style={{ background: '#CCF1E6', display: 'inline-block', padding: '1rem', borderRadius: '1rem' }}>
              <img src="/assets/icons/message-contained.svg" alt="" />
            </div>
          </Grid>
          <Grid item xs={8} sx={{ marginLeft: '10px' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <div>
                <div>
                  Contacted
                  <Tooltip title="Unique number of leads that have been contacted once on this campaign." arrow>
                    <IconButton>
                      <GoInfo />
                    </IconButton>
                  </Tooltip>
                </div>
                {/* <Typography variant="h5">{newCampaign?.contacted_percentage || 0}%</Typography> */}
                <Typography variant="h5">{newCampaign?.contacts_recipients || 0}</Typography>
              </div>
              <div>
                <div style={{ color: 'red' }}>&nbsp;</div>
                <div style={{ color: '#7C828D', textAlign: 'end' }}>
                  {/* {newCampaign?.contacts_recipients || 0} recipients */}
                </div>
              </div>
            </Box>
            <LinearProgress variant="determinate" value={0} />
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={8}>
        <ApexChart datas={newCampaign?.analytics} />
      </Grid>
    </Grid>
  );
};
