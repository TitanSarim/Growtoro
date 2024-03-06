import { createContext, useContext, useState } from 'react';
import { Alert, Snackbar } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';

const NotificationContext = createContext();

export const useNotification = () => useContext(NotificationContext);

const initState = {
  open: false,
  message: null,
  variant: 'success',
};

export const NotificationProvider = ({ children }) => {
  const [state, setState] = useState(children);
  const handleClose = () => setState(initState);
  const sendNotification = (values) => setState({ ...values });
  const Notification = () => (
    <Snackbar
      open={state.open}
      autoHideDuration={1000}
      onClose={handleClose}
      // sx={{ ml: '45%', mb: '1%', boxShadow: 12, borderRadius: 10 }}
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minWidth: '100%',
      }}
    >
      <Alert
        className="Alertbar"
        icon={state.alert === 'error' ? <ErrorIcon /> : <CheckCircleIcon />}
        sx={{
          '& .MuiAlert-icon': {
            color: state.alert === 'error' ? 'red' : 'green',
          },
          alignItems: 'center',
          fontSize: '2vh',
          maxWidth: 400,
          boxShadow: 12,
          borderRadius: '5px',
        }}
      >
        {state.message}
      </Alert>
    </Snackbar>
  );
  const value = {
    Notification,
    sendNotification,
  };

  return (
    <NotificationContext.Provider value={value}>
      {' '}
      <Notification /> {children}
    </NotificationContext.Provider>
  );
};
