import Api from './BaseApi';

class Plan extends Api {
  constructor(_axios) {
    super(_axios, '/tenant');
  }

  getAllSubscriptionPlans(tenantId) {
    return this.post(`/${tenantId}/get/product/plan`);
  }

  getCreditPlan(tenantId) {
    return this.post(`/${tenantId}/get/credit/plan`);
  }

  getCreditAmount(tenantId) {
    return this.get(`/${tenantId}/get/credit_amount`);
  }

  getActivePlan(tenantId) {
    return this.get(`/${tenantId}/get/active-plan`);
  }

  getMyPlan(tenantId) {
    return this.get(`/${tenantId}/get/my-plan`);
  }

  purchasePlan(tenantId, params) {
    return this.post(`/${tenantId}/plan/purchase`, params);
  }

  cancelPlan(tenantId) {
    return this.post(`/${tenantId}/cancel-subscription`);
  }
}

export default Plan;
