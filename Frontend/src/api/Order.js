import Api from './BaseApi';

class Order extends Api {
  constructor(_axios) {
    super(_axios, 'tenant');
  }

  getOrderList(tenantId) {
    return this.post(`/${tenantId}/get/order/list`);
  }

  getOrderDetails(tenantId, params) {
    return this.post(`/${tenantId}/get/order/details`, params);
  }
}
export default Order;
