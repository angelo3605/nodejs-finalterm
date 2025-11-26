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

    if (sorters?.length) {
      params.append("sortBy", sorters[0].field);
      params.append("sortInAsc", sorters[0].order === "asc" ? 1 : 0);
    }

    if (filters?.length) {
      filters.forEach((filter) => {
        params.append(filter.field, filter.value);
      });
    }

    return api.get(`/${resource}?${params.toString()}`).then((res) => res.data);
  },

  create: ({ resource, variables }) => {
    return api.post(`/${resource}`, variables).then((res) => res.data);
  },

  deleteOne: ({ resource, id }) => {
    return api.delete(`/${resource}/${id}`).then((res) => res.data);
  },

  getApiUrl: () => api.defaults.baseURL,

  custom: ({ url, method, query, payload }) => {
    const params = query
      ? Object.fromEntries(
          Object.entries(query).filter(
            ([_, value]) =>
              value !== "" && value !== null && value !== undefined,
          ),
        )
      : {};
    return (
      method === "get"
        ? api.get(url, { params })
        : api[method](url, payload, { params })
    )
      .then((res) => res.data)
      .catch((err) => err.response?.data);
  },
};
