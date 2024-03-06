import AccountAnalytics from 'components/tables/AccountAnalytics';
import CampaignAnalytics from 'components/tables/CampaignAnalytics';

import Flow from 'pages/Campaigns/Components/Flow';
import Analytics from 'pages/Campaigns/Components/Analytics';
import Schedule from 'pages/Campaigns/Components/Schedule';
import Settings from 'pages/Campaigns/Components/Settings';
import Contacts from 'pages/Campaigns/Components/Contacts';

export const tabitems = [
  {
    title: 'Analytics',
    component: <Analytics />,
  },
  {
    title: 'Contacts',
    component: <Contacts />,
  },
  {
    title: 'Flow',
    component: <Flow />,
  },
  {
    title: 'Schedule',
    component: <Schedule />,
  },
  {
    title: 'Settings',
    component: <Settings />,
  },
];

export const analyticstabitems = [
  {
    title: 'Campaign Analytics',
    component: <CampaignAnalytics />,
  },
  {
    title: 'Account Analytics',
    component: <AccountAnalytics />,
  },
];
