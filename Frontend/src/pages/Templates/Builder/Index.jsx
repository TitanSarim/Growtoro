import React, { useEffect } from 'react';
import useBee from 'hooks/useBee';
// import Layout from 'components/layout';
import Loading from 'components/Loading';
import { Box } from '@mui/material';

const TemplatesBuilders = () => {
  const { start, loading } = useBee();

  useEffect(() => {
    start('bee-plugin-container');
  }, [start]);

  return (
    <>
      <div id="bee-plugin-container">
        {loading && (
          <Box sx={{ width: '100%', height: '150%', display: 'flex' }}>
            <Loading />
          </Box>
        )}
      </div>
    </>
  );
};

export default TemplatesBuilders;
