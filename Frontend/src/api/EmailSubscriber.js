import Api from './BaseApi';

class EmailSubscriber extends Api {
  constructor(_axios) {
    super(_axios, '/tenant');
  }

  getEmailSubscriber(tenantId, listId) {
    return this.get(`/${tenantId}/email_lists/subscriber/${listId}`, {
      tenant_id: tenantId,
      list_id: listId,
    });
  }

  createEmailSubscriber(tenantId, data) {
    return this.post(`/${tenantId}/email_list/subscriber/create`, data);
  }

  deleteEmailSubscriber(tenantId, params) {
    return this.post(`/${tenantId}/email_list/subscriber/list/delete`, params);
  }
}

export default EmailSubscriber;
