import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useIntercom } from 'react-use-intercom';
import initHelpHero from 'helphero';

import Axios from 'api/AxiosDefaults';
import { useUser } from 'context/UserContext';
import { useEmail } from 'context/EmailContext';
// import { useTemplate } from 'context/TemplateContext';

const intercomId = process.env.REACT_APP_INTERCOM_ID || '941d5vl0aS';
const helpHeroId = process.env.REACT_APP_HELPHERO_ID || 'vtXbLOMr5C';

const FetchInitData = ({ children }) => {
  const navigate = useNavigate();
  const hlp = initHelpHero(helpHeroId);
  
  const { setUserData } = useUser();
  const { getAllEmails } = useEmail();
  const { user } = useUser();
  const { boot } = useIntercom();

  const [authorizing, setAuthorizing] = useState(true);

  useEffect(() => {
    // get user from local storage
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      // set user to user context
      setUserData(user);
      Axios.defaults.headers.common.Authorization = user.access_token;
    }
    setAuthorizing(false);
  }, [navigate, setUserData]);

  useEffect(() => {
    getAllEmails(user?.tenant_id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.tenant_id]);

  useEffect(() => {
    if (user?.tenant_id) {
      boot({
        app_id: intercomId,
        name: user?.user?.name,
        email: user?.user?.email,
        userId: user?.tenant_id,
      });
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.tenant_id]);

  useEffect(() => {
    if (user?.tenant_id) {
      hlp.identify(user?.tenant_id, {
        name: user?.user?.name,
        created_at: user.created_at
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.tenant_id]);

  return authorizing ? 'Loading..' : children;
};

export default FetchInitData;
