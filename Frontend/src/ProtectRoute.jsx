import { useUser } from 'context/UserContext';
import { Navigate } from 'react-router-dom';
import ThemeProvider from 'theme';

import Layout from 'components/layout';

import 'react-calendar/dist/Calendar.css';
import 'theme/app.css';

const ProtectRoute = ({ children }) => {
  const { user } = useUser();
  if (!user) {
    return <Navigate to="/login" />;
  }
  return (
    <ThemeProvider>
      <Layout>{children}</Layout>
    </ThemeProvider>
  );
};

export default ProtectRoute;
