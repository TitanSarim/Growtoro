import axios from 'axios';
import { useNotification } from 'context/NotificationContext';
import { useUser } from 'context/UserContext';
import { useNavigate } from 'react-router-dom';

axios.defaults.baseURL = process.env.REACT_APP_API_URL;
axios.defaults.headers.common = {
  Accept: 'application/json',
  'Content-Type': '`multipart/form-data',
};

axios.interceptors.response.use(
  (response) => response,
  (error) => {
    // redirect to login page if 401 error occurs
    if (error.response?.status === 401) {
      // localStorage.removeItem('token');
      // window.location.href = '/login';

      const { sendNotification } = useNotification();
      const navigate = useNavigate();
      const { setUserData, setData } = useUser();
      localStorage.removeItem('user');
      setUserData(null);
      setData(null);
      sendNotification({
        open: true,
        message: 'Logout Successful',
        alert: 'success',
      });

      navigate('/login');
    }

    return Promise.reject(error);
  }
);

export default axios;
