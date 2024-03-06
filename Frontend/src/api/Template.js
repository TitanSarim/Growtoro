import Api from './BaseApi';

class Template extends Api {
  constructor(_axios) {
    super(_axios, '/tenant');
  }

  getAllTemplates(tenantId, params) {
    if (params.tag) {
      return this.get(`/${tenantId}/templates?page=${params.page + 1}&page_size=${params.pageSize}&tag=${params.tag}`);
    }

    return this.get(`/${tenantId}/templates?page=${params.page + 1}&page_size=${params.pageSize}`);
  }

  createTemplate(tenantId, params) {
    return this.post(`/${tenantId}/template`, params);
  }

  updateTemplate(tenantId, params) {
    return this.post(`/${tenantId}/template/update`, params);
  }

  removeTemplate(tenantId, params) {
    return this.post(`/${tenantId}/template/delete`, params);
  }
}

export default Template;
