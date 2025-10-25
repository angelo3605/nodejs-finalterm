import { api } from "@mint-boutique/axios-client";

export const dataProvider = {
  getMany: async ({ resource, ids, meta }) => {
    const params = new URLSearchParams();

    if (ids) {
      ids.forEach((id) => params.append("id", id));
    }

    const { data } = await api.get(`/${resource}?${params.toString()}`);
    return { data: data[resource] };
  },

  getOne: async ({ resource, id, meta }) => {
    const { data } = await api.get(`/${resource}/${id}`);
    return { data: Object.values(data)[0] };
  },

  update: async ({ resource, id, variables }) => {
    const { data } = await api.patch(`/${resource}/${id}`, variables);
    return { data };
  },

  getList: async ({ resource, pagination, filters, sorters, meta }) => {
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

    const { data } = await api.get(`/${resource}?${params.toString()}`);
    return { data: data[resource], total: data.count ?? data[resource].length };
  },

  create: async ({ resource, variables }) => {
    const { data } = await api.post(`/${resource}`, variables);
    return { data: Object.values(data)[0] };
  },

  deleteOne: async ({ resource, id }) => {
    const { data } = await api.delete(`/${resource}/${id}`);
    return { data: Object.values(data)[0] };
  },

  getApiUrl: () => api.defaults.baseURL,
};
