import Api from './BaseApi';

class EmailAccount extends Api {
  constructor(_axios) {
    super(_axios, '/tenant');
  }

  getAllEmailAccounts(tenantId) {
    return this.get(`/${tenantId}/email_accounts`);
  }

  createEmailAccount(tenantId, params) {
    return this.post(`/${tenantId}/email_account`, params);
  }

  updateEmailAccount(tenantId, params) {
    return this.post(`/${tenantId}/email_account/update`, params);
  }

  updateEmailStatus(tenantId, params) {
    return this.post(`/${tenantId}/email_account/status`, params);
  }

  removeEmailAccount(tenantId, params) {
    return this.post(`/${tenantId}/email_account/delete`, params);
  }
}

export default EmailAccount;
