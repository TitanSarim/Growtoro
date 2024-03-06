import Api from './BaseApi';

class Leads extends Api {
  constructor(_axios) {
    super(_axios, '/tenant');
  }

  b2bRequest(tenantId, params) {
    return this.post(`/${tenantId}/b2b-request`, params);
  }

  b2cRequest(tenantId, params) {
    return this.post(`/${tenantId}/b2c-request`, params);
  }

  customLeadFaqs(tenantId) {
    return this.get(`/${tenantId}/custom-lead-faqs`);
  }
}

export default Leads;
