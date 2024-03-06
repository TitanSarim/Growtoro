import { createContext, useContext, useState, useMemo, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import Api from 'api/Api';
import axiosService from 'api/AxiosDefaults';
import ErrorHandling from 'utils/ErrorHandling';
import { useNotification } from './NotificationContext';

const UserContext = createContext();

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { sendNotification } = useNotification();

  const [isAuthLoading, setIsAuthLoading] = useState([]);
  const [userData, setUserData] = useState();
  const [data, setData] = useState(null);
  const [unread, setUnread] = useState(null);

  const memoizedLocation = useMemo(() => location, [location]);

  useMemo(() => {
    if (userData?.tenant_id) {
      Api.plan
        .getCreditAmount(userData?.tenant_id)
        .then((res) => {
          setData(res.data.data);
        })
        .catch((e) => ErrorHandling({ e, sendNotification }));
    }

    if (!unread && userData) {
      Api.unibox
        .unreadMail(userData?.tenant_id)
        .then((res) => {
          setUnread(res.data.unread_replies);
        })
        .catch((e) => ErrorHandling({ e, sendNotification }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userData?.tenant_id]);

  useEffect(() => {
    if (userData?.tenant_id) {
      Api.unibox.unreadMail(userData?.tenant_id).then((res) => {
        setUnread(res.data.unread_replies);
      });
    }
  }, [memoizedLocation, userData?.tenant_id]);

  const login = (credentials) => {
    setIsAuthLoading((prev) => ({ ...prev, login: true }));
    Api.auth
      .login(credentials)
      .then((response) => {
        if (response.data.status === 'success') {
          axiosService.defaults.headers.common.Authorization = response.data.access_token;
          localStorage.setItem('user', JSON.stringify(response.data));
          setUserData(response.data);
          navigate('/email-accounts');
        }
      })
      .catch((e) => {
        ErrorHandling({ e, sendNotification });
      })
      .finally(() => {
        setIsAuthLoading((prev) => ({ ...prev, login: false }));
      });
  };

  const register = (credentials) => {
    setIsAuthLoading((prev) => ({ ...prev, register: true }));
    Api.auth
      .register(credentials)
      .then((response) => {
        if (response.data.status === 'error') {
          console.log('error');
        } else {
          navigate('/verify-email');
          // console.log(response.data);
        }
      })
      .catch((e) => {
        ErrorHandling({ e, sendNotification });
      })
      .finally(() => {
        setIsAuthLoading((prev) => ({ ...prev, register: false }));
      });
  };

  const forgotPassword = (credentials) => {
    setIsAuthLoading((prev) => ({ ...prev, forgotPassword: true }));
    Api.auth
      .forgotPassword({ email: credentials })
      .then((response) => {
        // console.log(response.data.message);
        sendNotification({
          open: true,
          message: response.data.message,
          alert: 'success',
        });
      })
      .catch((e) => {
        ErrorHandling({ e, sendNotification });
      })
      .finally(() => {
        setIsAuthLoading((prev) => ({ ...prev, forgotPassword: false }));
      });
  };

  const resetPassword = (credentials) => {
    setIsAuthLoading((prev) => ({ ...prev, resetPassword: true }));
    Api.auth
      .resetPassword(credentials)
      .then((response) => {
        // console.log(response.data.message);
        sendNotification({
          open: true,
          message: response.data.message,
          alert: 'success',
        });
        navigate('/login');
      })
      .catch((e) => {
        ErrorHandling({ e, sendNotification });
      })
      .finally(() => {
        setIsAuthLoading((prev) => ({ ...prev, resetPassword: false }));
      });
  };

  const verifyAccount = (credentials) => {
    setIsAuthLoading((prev) => ({ ...prev, verifyAccount: true }));
    Api.auth
      .verifyAccount(credentials)
      .then((response) => {
        if (response.data.status === 'success') {
          axiosService.defaults.headers.common.Authorization = response.data.access_token;
          localStorage.setItem('user', JSON.stringify(response.data));
          setUserData(response.data);
          navigate('/email-accounts');
        }
      })
      .catch((e) => {
        ErrorHandling({ e, sendNotification });
      })
      .finally(() => {
        setIsAuthLoading((prev) => ({ ...prev, verifyAccount: false }));
      });
  };

  const values = {
    user: userData,
    setUserData,
    login,
    register,
    isAuthLoading,
    forgotPassword,
    resetPassword,
    verifyAccount,
    data,
    setData,
    unread,
    setUnread,
  };

  return <UserContext.Provider value={values}>{children}</UserContext.Provider>;
};
