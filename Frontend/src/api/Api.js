import axios from './AxiosDefaults';
import Auth from './Auth';
import Profile from './Profile';
import Order from './Order';
import Cart from './Cart';
import Plan from './Plan';
import Campaign from './Campaign';
import EmailAccount from './EmailAccount';
import Template from './Template';
import EmailList from './EmailList';
import EmailSubscriber from './EmailSubscriber';
import Leads from './Leads';
import Unibox from './Unibox';

const auth = new Auth(axios);
const profile = new Profile(axios);
const campaign = new Campaign(axios);
const email = new EmailAccount(axios);
const template = new Template(axios);
const order = new Order(axios);
const cart = new Cart(axios);
const plan = new Plan(axios);
const emailList = new EmailList(axios);
const emailSubscriber = new EmailSubscriber(axios);
const leads = new Leads(axios);
const unibox = new Unibox(axios);

export default {
  auth,
  profile,
  campaign,
  email,
  template,
  order,
  cart,
  plan,
  emailList,
  emailSubscriber,
  leads,
  unibox,
};
