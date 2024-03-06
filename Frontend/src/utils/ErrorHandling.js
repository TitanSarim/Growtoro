const ErrorHandling = ({ e, sendNotification }) => {
  if (e?.response?.status === 422) {
    let _err = [];
    const errors = e?.response?.data?.error;
    if (errors) {
      Object.values(errors).forEach((value) => {
        _err = [..._err, ...value];
      });
    }
    sendNotification({
      open: true,
      message: _err[0],
      alert: 'error',
    });
  } else if (e.response?.status === 403) {
    sendNotification({
      open: true,
      message: e.response.data.error,
      alert: 'error',
    });
  } else {
    sendNotification({
      open: true,
      message: 'Something went wrong',
      alert: 'error',
    });
  }
};

export default ErrorHandling;
