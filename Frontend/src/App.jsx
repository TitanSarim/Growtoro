import Router from 'routes';

import { CampaignProvider } from 'context/CampaignContext';
import { EmailProvider } from 'context/EmailContext';
import { TemplateProvider } from 'context/TemplateContext';
import { UserProvider } from 'context/UserContext';
import { NotificationProvider } from 'context/NotificationContext';

import ContextProvider from 'context/ContextProvider';
import FetchInitData from 'components/FetchInitData';

export default function App() {
  return (
    <ContextProvider
      components={[NotificationProvider, CampaignProvider, EmailProvider, TemplateProvider, UserProvider]}
    >
      <FetchInitData>
        <Router />
      </FetchInitData>
    </ContextProvider>
  );
}
