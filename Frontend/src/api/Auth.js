import Api from './BaseApi';

class Auth extends Api {
  constructor(_axios) {
    super(_axios, '/tenant');
  }

  login(params) {
    return this.post('/login', params);
  }

  register(params) {
    return this.post('/register', params);
  }

  forgotPassword(params) {
    return this.post('/forgot-password', params);
  }

  resetPassword(params) {
    return this.post('/reset-password', params);
  }

  verifyAccount(params) {
    return this.post('/verify-account', params);
  }
}

export default Auth;
