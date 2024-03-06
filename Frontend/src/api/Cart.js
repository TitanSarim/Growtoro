import Api from './BaseApi';

class Cart extends Api {
  constructor(_axios) {
    super(_axios, '/tenant');
  }

  getCartData(tenantId) {
    return this.post(`/${tenantId}/get/cart/data`);
  }

  addCart(tenantId, params) {
    return this.post(`/${tenantId}/add/cart`, params);
  }

  removeCartData(tenantId, Id) {
    return this.get(`/${tenantId}/cart/data/remove/${Id}`);
  }

  checkoutSubmit(tenantId, params) {
    return this.post(`/${tenantId}/checkout/save`, params);
  }
}

export default Cart;
