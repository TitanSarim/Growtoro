import Api from './BaseApi';

class Campaign extends Api {
  constructor(_axios) {
    super(_axios, '/tenant');
  }

  getAllCampaign(tenantId, params) {
    return this.get(`/${tenantId}/drip_campaign?page=${params.page + 1}&page_size=${params.pageSize}`);
  }

  parseCsv(tenantId, params) {
    return this.postFormData(`/${tenantId}/parse-csv`, {
      csv_file: params.csv_file,
    });
  }

  csvFileWithKey(tenantId, params) {
    return this.post(`/${tenantId}/setCsvFileWithKey`, params);
  }

  searchByEmail(tenantId, params) {
    return this.get(`/${tenantId}/drip_campaign?page=${params.page + 1}&page_size=${params.pageSize}&q=${params.q}`);
  }

  getCampaignById(tenantId, id) {
    return this.get(`/${tenantId}/drip_campaign/${id}`);
  }

  createCampaign(tenantId, params) {
    return this.post(`/${tenantId}/drip_campaign/create`, params);
  }

  updateCampaign(tenantId, params) {
    return this.post(`/${tenantId}/drip_campaign/update`, params);
  }

  updateCampaignStatus(tenantId, params) {
    return this.post(`/${tenantId}/drip_campaign/status`, params);
  }

  sendTestEmail(tenantId, params) {
    return this.post(`/${tenantId}/drip_campaign/send-email`, params);
  }

  saveList(tenantId, params) {
    return this.get(`/${tenantId}/saved-email-list?page=${params.page + 1}&page_size=${params.pageSize}`);
  }

  getEmailListByEmail(tenantId, params) {
    return this.get(`/${tenantId}/saved-email-list?page=${params.page + 1}&page_size=${params.pageSize}&q=${params.q}`);
  }

  removeCampaign(tenantId, params) {
    return this.post(`/${tenantId}/drip_campaign/delete`, params);
  }

  checkDuplicate(tenantId, params) {
    return this.post(`/${tenantId}/drip_campaign/check_duplicate`, params);
  }

  cloneCampaign(tenantId, params) {
    return this.post(`/${tenantId}/drip_campaign/clone`, params);
  }

  analyticsList(tenantId) {
    return this.get(`/${tenantId}/drip_campaign/analytics/list`);
  }

  analyticsCounters(tenantId) {
    return this.get(`/${tenantId}/drip_campaign/analytics/counters`);
  }

  analyticsCountersDate(tenantId, start, end) {
    return this.get(`/${tenantId}/drip_campaign/analytics/counters?start_date=${start}&end_date=${end}`);
  }

  analyticsStats(tenantId) {
    return this.get(`/${tenantId}/drip_campaign/analytics/stats`);
  }

  analyticsStatsDate(tenantId, start, end) {
    return this.get(`/${tenantId}/drip_campaign/analytics/stats?start_date=${start}&end_date=${end}`);
  }

  getInstructions(tenantId) {
    return this.get(`/${tenantId}/instruction/list`);
  }

  deleteContact(tenantId, params) {
    return this.post(`/${tenantId}/email_list/subscriber/list/delete`, params);
  }
}

export default Campaign;
