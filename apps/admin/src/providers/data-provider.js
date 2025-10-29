import { api } from "@mint-boutique/axios-client";

export const dataProvider = {
  getMany: ({ resource, ids, meta }) => {
    const params = new URLSearchParams();
    if (ids) {
      ids.forEach((id) => params.append("id", id));
    }
    return api.get(`/${resource}?${params.toString()}`).then((res) => res.data);
  },

  getOne: ({ resource, id, meta }) => {
    return api.get(`/${resource}/${id}`).then((res) => res.data);
  },

  update: ({ resource, id, variables }) => {
    return api.patch(`/${resource}/${id}`, variables).then((res) => res.data);
  },

  getList: ({ resource, pagination, filters, sorters, meta }) => {
    const params = new URLSearchParams();

    if (pagination) {
      params.append("page", pagination.currentPage);
      params.append("pageSize", pagination.pageSize);
    }

    /* if (sorters && sorters.length > 0) {
      params.append("_sort", sorters.map((sorter) => sorter.field).join(","));
      params.append("_order", sorters.map((sorter) => sorter.order).join(","));
    }

    if (filters && filters.length > 0) {
      filters.forEach((filter) => {
        if ("field" in filter && filter.operator === "eq") {
          // Our fake API supports "eq" operator by simply appending the field name and value to the query string.
          params.append(filter.field, filter.value);
        }
      });
    } */

    return api.get(`/${resource}?${params.toString()}`).then((res) => res.data);
  },

  create: ({ resource, variables }) => {
    return api.post(`/${resource}`, variables).then((res) => res.data);
  },

  deleteOne: ({ resource, id }) => {
    return api.delete(`/${resource}/${id}`).then((res) => res.data);
  },

  getApiUrl: () => api.defaults.baseURL,

  custom: ({ url, method }) => {
    return api[method](url).then((res) => res.data);
  },
};
