import { Typography } from '@mui/material';
import SvgColor from 'components/svg-color';

const icon = (name) => <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />;

const navConfig = [
  {
    title: 'All campaigns',
    path: '/campaigns',
    icon: icon('ic_campains'),
  },
  {
    title: 'Email Accounts',
    path: '/email-accounts',
    icon: icon('ic_inbox'),
  },
  {
    title: 'Analytics',
    path: '/analytics',
    icon: icon('ic_analytics'),
  },
  {
    title: 'Templates',
    path: '/all-templates',
    icon: icon('ic_templates'),
    // subNav: [
    //   {
    //     navTitle: 'All Templates',
    //     path: '/all-templates',
    //     navIcon: icon('ic_all'),
    //   },
    //   {
    //     navTitle: 'Template builder',
    //     path: '/template-builder',
    //     navIcon: icon('ic_builder'),
    //   },
    // ],
  },
  {
    title: 'Unibox',
    path: '/unibox',
    icon: icon('ic_unibox'),
  },
  {
    title: (
      <>
        <Typography variant="body2" fontWeight={800}>
          Database
        </Typography>
        <Typography variant="caption">(Coming Soon)</Typography>
      </>
    ),
    // path: '/database',
    icon: icon('ic_database'),
    // subNav: [
    //   {
    //     navTitle: 'Social Media',
    //     path: '/social-media',
    //     navIcon: icon('ic_mike'),
    //   },
    //   {
    //     navTitle: 'B2B',
    //     path: '/b2b',
    //     navIcon: icon('ic_bag'),
    //   },
    //   {
    //     navTitle: 'Wholesale',
    //     path: '/wholesale',
    //     navIcon: icon('ic_box'),
    //   },
    //   {
    //     navTitle: 'eCommerce',
    //     path: '/ecommerce',
    //     navIcon: icon('ic_cart'),
    //   },
    // ],
  },
  {
    title: 'Custom leads',
    path: '/custom-leads',
    icon: icon('ic_leads'),
  },
  {
    title: 'University',
    path: 'https://university.growtoro.com',
    target: '_blank', // added by me to open in new tab
    icon: icon('ic_university'),
  },
  {
    title: 'Lists',
    path: '/lists',
    icon: icon('ic_lists'),
  },
  {
    title: 'GrowtoroGPT',
    path: '/growtoro-gpt',
    icon: icon('ic_gpt'),
  },
  // {
  //   title: 'Roadmap',
  //   path: '/roadmap',
  //   icon: icon('ic_roadmap'),
  // },
];

export default navConfig;
