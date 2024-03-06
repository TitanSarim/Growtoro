import Api from './BaseApi';

class EmailList extends Api {
  constructor(_axios) {
    super(_axios, '/tenant');
  }

  getEmailList(tenantId) {
    return this.get(`/${tenantId}/email_lists`, {
      tenant_id: tenantId,
    });
  }

  deleteEmailList(tenantId, data) {
    return this.post(`/${tenantId}/email_list/delete`, data);
  }

  updateEmailList(tenantId, data) {
    return this.post(`/${tenantId}/email_list/update`, data);
  }
}

export default EmailList;
