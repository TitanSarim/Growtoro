import Api from './BaseApi';

class Unibox extends Api {
  constructor(_axios) {
    super(_axios, '/tenant');
  }

  getUnibox(tenantId, params) {
    return this.get(`/${tenantId}/unibox?page=${params.page + 1}`);
  }

  getUniboxByEmail(tenantId, params) {
    return this.get(`/${tenantId}/unibox?q=${params.q}&page=${params.page + 1}`);
  }

  readUnread(tenantId, params) {
    return this.post(`/${tenantId}/unibox/read-unread`, params);
  }

  leadStatus(tenantId, params) {
    return this.post(`/${tenantId}/unibox/lead-status`, params);
  }

  removeLead(tenantId, params) {
    return this.post(`/${tenantId}/unibox/remove-lead`, params);
  }

  sendMail(tenantId, params) {
    return this.post(`/${tenantId}/unibox/send-mail`, params);
  }

  unreadMail(tenantId) {
    return this.get(`/${tenantId}/unibox/unread-email`);
  }

  uniboxDelete(tenantId, id) {
    return this.delete(`/${tenantId}/unibox/${id}`);
  }
}

export default Unibox;
