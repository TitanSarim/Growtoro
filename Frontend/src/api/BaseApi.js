class BaseApi {
  constructor(_axios, _prefix = '') {
    this.axios = _axios;
    this.prefix = _prefix;
  }

  get(url, params = {}) {
    return this.axios.get(`${this.prefix}${url}`, {
      params,
    });
  }

  post(url, params = {}) {
    return this.axios.post(`${this.prefix}${url}`, params);
  }

  put(url, params = {}) {
    return this.axios.put(`${this.prefix}${url}`, params);
  }

  delete(url, params = {}) {
    return this.axios.delete(`${this.prefix}${url}`, {
      params,
    });
  }

  postFormData(url, params = {}) {
    const headers = {
      'Content-Type': 'multipart/form-data',
      Accept: 'application/json',
    };
    // eslint-disable-next-line no-undef
    const formData = new FormData();

    // eslint-disable-next-line no-restricted-syntax
    for (const key in params) {
      if (Array.isArray(params[key])) {
        params[key].forEach((item, i) => {
          if (typeof item === 'object') {
            // eslint-disable-next-line no-restricted-syntax, guard-for-in
            for (const itemKey in item) {
              formData.append(`${key}[${i}][${itemKey}]`, item[itemKey]);
            }
          }
        });
      } else {
        if (typeof params[key] === 'boolean') {
          params[key] = params[key] ? 1 : 0;
        }

        formData.append(key, params[key]);
      }
    }

    return this.axios.post(`${this.prefix}${url}`, formData, {
      headers,
    });
  }
}

export default BaseApi;
