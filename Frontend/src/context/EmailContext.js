import Api from 'api/Api';
import ErrorHandling from 'utils/ErrorHandling';
import { createContext, useCallback, useContext, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
import { useNotification } from './NotificationContext';

const EmailContext = createContext();

export const useEmail = () => useContext(EmailContext);

export const EmailProvider = ({ children }) => {
  // const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [editAble, setEditAble] = useState();
  const { sendNotification } = useNotification();
  const [emails, setEmails] = useState([]);
  const [emailNumber, setEmailNumber] = useState();

  const getAllEmails = useCallback(
    (params) => {
      setIsLoading(true);
      if (params)
        Api.email
          .getAllEmailAccounts(params)
          .then((response) => {
            // eslint-disable-next-line prefer-destructuring
            const data = response.data.data;
            setEmails(data);
            setEmailNumber({ total_rows: response.data.total_rows, limit: response.data.limit });
          })
          .catch((e) => {
            const _err = e?.message;
            sendNotification({
              open: true,
              message: _err,
              alert: 'error',
            });
          })
          .finally(() => {
            setIsLoading(false);
          });
    },
    [sendNotification]
  );

  const updateEmailStatus = (tenantId, params) => {
    Api.email
      .updateEmailStatus(tenantId, params)
      .then((res) => {
        setEmails((prevArray) =>
          prevArray.map((item) => {
            if (item.id === params.id) {
              const _status = params.value;
              return { ...item, [params.type]: _status };
            }
            return item;
          })
        );
        sendNotification({
          open: true,
          message: res.data.success,
          alert: 'success',
        });
        setEditAble();
      })
      .catch((e) => {
        ErrorHandling({ e, sendNotification });
      });
  };

  const deleteEmail = (tenantId, _id) => {
    Api.email
      .removeEmailAccount(tenantId, { id: _id })
      .then(() => {
        const data = emails.filter((email) => email.id !== _id);
        setEmails(data);
        sendNotification({
          open: true,
          message: 'Email account deleted',
          alert: 'success',
        });
        setEditAble();
      })
      .catch((e) => {
        ErrorHandling({ e, sendNotification });
      });
  };

  const value = {
    emails,
    setEmails,
    getAllEmails,
    // createEmail,
    editAble,
    setEditAble,
    // updateEmail,
    // loadButton,
    isLoading,
    deleteEmail,
    updateEmailStatus,
    emailNumber,
    setEmailNumber,
  };

  return <EmailContext.Provider value={value}>{children}</EmailContext.Provider>;
};
