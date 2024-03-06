import { Grid } from '@mui/material';
import { Children, cloneElement, useState } from 'react';
// import {  } from 'react';
import Aside from './aside';
import Nav from './nav';

const Layout = ({ children }) => {
  const [dash, setDash] = useState(false);
  const childrenWithProps = Children.map(children, (child) => cloneElement(child, { dash, setDash }));

  return (
    <div style={{ width: '100%', height: '100%', overflow: 'hidden', display: "flex", flexDirection: "column" }}>
      <Grid item sx={{ background: '#ffff', flex: 1, height: '70px', border: '0px solid black', boxShadow: 1 }}>
        <Nav />
      </Grid>
      <Grid item sx={{ width: '100%', height: '100%', flexGrow: 1 }}>
        <Grid container sx={{height: "100%"}}>
          <Grid item sx={{ background: '#fff', height: '100%' }}>
            <Aside isCloseNav={dash} />
          </Grid>
          <Grid item sx={{ flex: 1, height: "100%", overflowX: 'hidden', p: 1, borderLeft: '1px dashed #919eab3d' }}>
            {childrenWithProps}
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
};

export default Layout;
