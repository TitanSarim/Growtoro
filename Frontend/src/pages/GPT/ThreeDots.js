import { makeStyles } from '@mui/styles';
import React from 'react';

const useStyles = makeStyles(() => ({
  custom: {
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  balls: {
    display: 'flex',
    alignItems: 'center',
    marginTop: '0.5rem',
  },
  ball: {
    width: '10px',
    height: '10px',
    borderRadius: '50%',
    backgroundColor: 'grey',
    marginRight: '10px',
    animation: '$ball 0.5s ease infinite alternate',
  },
  ball2: {
    animationDelay: '0.1s',
  },
  ball3: {
    animationDelay: '0.2s',
  },

  '@keyframes ball': {
    to: {
      transform: 'translateY(-10px)',
    },
  },
}));

const ThreeDots = () => {
  const classes = useStyles();

  return (
    <div className={classes.custom}>
      <div className={classes.balls}>
        <div className={`${classes.ball} ${classes.ball1}`} />
        <div className={`${classes.ball} ${classes.ball2}`} />
        <div className={`${classes.ball} ${classes.ball3}`} />
      </div>
    </div>
  );
};

export default ThreeDots;
