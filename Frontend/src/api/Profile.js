import Api from './BaseApi';

class Profile extends Api {
  constructor(_axios) {
    super(_axios, '/tenant');
  }

  usage(tenantId, params) {
    return this.get(`/${tenantId}/usage`, params);
  }

  updateProfile(tenantId, params) {
    return this.post(`/${tenantId}/update/profile`, params);
  }

  createBlockList(tenantId, params) {
    return this.post(`/${tenantId}/block-lists`, params);
  }

  deleteBlockList(tenantId, params) {
    return this.post(`/${tenantId}/block-lists/delete`, params);
  }

  getBlockList(tenantId, params) {
    return this.get(`/${tenantId}/block-lists?page=${params.page + 1}&page_size=${params.pageSize}`);
  }

  deleteAccount(tenantId) {
    return this.post(`/${tenantId}/delete-account`);
  }
}

export default Profile;
