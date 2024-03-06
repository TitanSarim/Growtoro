import { useRoutes } from 'react-router-dom';

// layouts
import ProtectRoute from 'ProtectRoute';
// import { useUser } from 'context/UserContext';

import GPT from 'pages/GPT';
import Lists from 'pages/Lists';
import Page404 from 'pages/404';
import Analytics from 'pages/Analytics';
import Profile from 'pages/Profile/Index';
import Unibox from 'pages/Unibox/Index';
// import Unibox2 from 'pages/Unibox2/Index';
import Login from 'pages/AuthPages/Login';
import University from 'pages/University/Index';
import SignUp from 'pages/AuthPages/Signup';
import B2B from 'pages/Databases/Pages/B2B';
import Campaigns from 'pages/Campaigns/Index';
import Templates from 'pages/Templates/All/Index';

import { CustomLeads } from 'pages/CustomLeads/Index';
import EmailVerify from 'pages/AuthPages/EmailVerify';
import EmailAccounts from 'pages/EmailAccounts/Index';
import EditCampaign from 'pages/Campaigns/Edit/Index';
import NewCampaign from 'pages/Campaigns/New/Index';
import Wholesale from 'pages/Databases/Pages/Wholesale';
import Ecommerce from 'pages/Databases/Pages/Ecommerce';
import Socialmedia from 'pages/Databases/Pages/Socialmedia';
import ForgotPassword from 'pages/AuthPages/ForgotPassword';
import TemplatesBuilder from 'pages/Templates/Builder/Index';

export default function Router() {
  // get user from local storage
  // const { user } = useUser();
  // const isAuthenticated = user ? 'true' : 'false';

  const routes = useRoutes([
    {
      path: '/',
      element: (
        <ProtectRoute>
          <Campaigns />
        </ProtectRoute>
      ),
    },

    {
      path: '/campaigns',
      element: (
        <ProtectRoute>
          <Campaigns />
        </ProtectRoute>
      ),
    },
    {
      path: '/login',
      element: <Login />,
    },
    {
      path: '/signup',
      element: <SignUp />,
    },
    {
      path: '/verify-email',
      element: <EmailVerify />,
    },
    {
      path: '/forgot-password',
      element: <ForgotPassword />,
    },
    {
      path: '/campaigns/new',
      element: (
        <ProtectRoute>
          <NewCampaign />
        </ProtectRoute>
      ),
    },
    {
      path: '/campaigns/:id/edit',
      element: (
        <ProtectRoute>
          <EditCampaign />
        </ProtectRoute>
      ),
    },
    {
      path: '/email-accounts',
      element: (
        <ProtectRoute>
          <EmailAccounts />
        </ProtectRoute>
      ),
    },
    {
      path: '/analytics',
      element: (
        <ProtectRoute>
          <Analytics />
        </ProtectRoute>
      ),
    },

    {
      path: '/social-media',
      element: (
        <ProtectRoute>
          <Socialmedia />
        </ProtectRoute>
      ),
    },
    {
      path: '/b2b',
      element: (
        <ProtectRoute>
          <B2B />
        </ProtectRoute>
      ),
    },
    {
      path: '/wholesale',
      element: (
        <ProtectRoute>
          <Wholesale />
        </ProtectRoute>
      ),
    },
    {
      path: '/ecommerce',
      element: (
        <ProtectRoute>
          <Ecommerce />
        </ProtectRoute>
      ),
    },
    {
      path: '/profile',
      element: (
        <ProtectRoute>
          <Profile />
        </ProtectRoute>
      ),
    },
    {
      path: '/university',
      element: (
        <ProtectRoute>
          <University />
        </ProtectRoute>
      ),
    },
    {
      path: '/custom-leads',
      element: (
        <ProtectRoute>
          <CustomLeads />
        </ProtectRoute>
      ),
    },
    {
      path: '/all-templates',
      element: (
        <ProtectRoute>
          <Templates />
        </ProtectRoute>
      ),
    },
    {
      path: '/template-builder',
      element: (
        <ProtectRoute>
          <TemplatesBuilder />
        </ProtectRoute>
      ),
    },

    {
      path: '/unibox',
      element: (
        <ProtectRoute>
          <Unibox />
        </ProtectRoute>
      ),
    },

    // {
    //   path: '/unibox2',
    //   element: (
    //     <ProtectRoute>
    //       <Unibox2 />
    //     </ProtectRoute>
    //   ),
    // },

    {
      path: '/lists',
      element: (
        <ProtectRoute>
          <Lists />
        </ProtectRoute>
      ),
    },
    {
      path: '/growtoro-gpt',
      element: (
        <ProtectRoute>
          <GPT />
        </ProtectRoute>
      ),
    },
    {
      path: '*',
      element: (
        <ProtectRoute>
          <Page404 />
        </ProtectRoute>
      ),
    },
  ]);

  return routes;
}
