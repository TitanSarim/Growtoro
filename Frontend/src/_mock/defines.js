import { MdSubtitles, MdOutlineRealEstateAgent, MdOutlineHomeWork, MdOutlineEmail } from 'react-icons/md';
import { HiHomeModern } from 'react-icons/hi2';

export const modalType = {
  AccountType: 'AccountType',
  Close: 'Close',
  ConnectSMTP: 'ConnectSMTP',
  SelectType: 'SelectType',
  CampaignDetails: 'CampaignDetails',
  ConfirmCampaign: 'ConfirmCampaign',
  ManualEmails: 'ManualEmails',
  SaveList: 'SaveList',
  LeadTemplates: 'LeadTemplates',
  EmailPreview: 'EmailPreview',
  Templates: 'TemplatesPopup',
  EditTemplates: 'EditTemplates',
  ComfirmSequenceTemplate: 'ComfirmSequenceTemplate',
  LaunchCampaign: 'LaunchCampaign',
  PauseCampaign: 'PauseCampaign',
  Deliverability: 'Deliverability',
  DeleteEmail: 'DeleteEmail',
  Permission: 'Permission',
  Logout: 'Logout',
};

export const datas = [
  {
    type: [
      {
        name: 'SendingAccountFullName',
        image: <img src={'/assets/icons/firstName.svg'} alt="icon" style={{ marginRight: '10px' }} />,
        value: 'first_name',
      },
      {
        name: 'First Name',
        image: <img src={'/assets/icons/firstName.svg'} alt="icon" style={{ marginRight: '10px' }} />,
        value: 'first_name',
      },
      {
        name: 'Last Name',
        image: <img src={'/assets/icons/lastName.svg'} alt="icon" style={{ marginRight: '10px' }} />,
        value: 'last_name',
      },
      {
        name: 'Email',
        image: <MdOutlineEmail size={20} style={{ marginRight: '10px', color: 'blue' }} />,
        // image: <img src={'/assets/icons/email1.svg'} alt="icon" style={{ marginRight: '10px' }} />,
        value: 'email',
      },
      {
        name: 'Job Title',
        image: <MdSubtitles size={20} style={{ marginRight: '10px', color: 'blue' }} />,
        value: 'job_title',
      },
      {
        name: 'State',
        image: <MdOutlineRealEstateAgent size={20} style={{ marginRight: '10px', color: 'blue' }} />,
        value: 'state',
      },
      {
        name: 'Country',
        image: <HiHomeModern size={20} style={{ marginRight: '10px', color: 'blue' }} />,
        value: 'country',
      },
      {
        name: 'City',
        image: <MdOutlineHomeWork size={20} style={{ marginRight: '10px', color: 'blue' }} />,
        value: 'city',
      },
      {
        name: 'Do not import',
        image: <img src={'/assets/icons/import.svg'} alt="icon" style={{ marginRight: '10px' }} />,
        value: 'do_not_import',
      },
    ],
  },
];
export const manualEmails = [
  {
    email: 'username1@example.com',
    firstName: 'Name1',
    lastName: 'LastName1',
  },
  {
    email: 'username2@example.com',
    firstName: 'Name2',
    lastName: 'LastName2',
  },
  {
    email: 'username3@example.com',
    firstName: 'Name3',
    lastName: 'LastName3',
  },
  {
    email: 'username4@example.com',
    firstName: 'Name4',
    lastName: 'LastName4',
  },
  {
    email: 'username5@example.com',
    firstName: 'Name5',
    lastName: 'LastName5',
  },
  {
    email: 'username6@example.com',
    firstName: 'Name6',
    lastName: 'LastName6',
  },
];

// export const tagOptions = ['Sales', 'Follow Up', 'SEO', 'Recruitment', 'Networking', 'Marketing'];
export const tagOptions = [
  'Sales',
  'Prospecting',
  'Growth Marketing',
  'Freelancer',
  'SAAS',
  'Follow Up',
  'Networking',
  'Community Building',
  'Agency',
  'Wholesale',
  'Book Meeting',
  'eCommerce',
];
