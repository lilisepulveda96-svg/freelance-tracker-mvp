import type {
  DataProvider,
  GetListParams,
  GetOneParams,
  CreateParams,
  UpdateParams,
  DeleteParams,
} from "react-admin";
import { axiosClient } from "../config/axiosClient";

export const dataProvider: DataProvider = {
  getList: async (resource: string, params: GetListParams) => {
    const { page = 1, perPage = 10 } = params.pagination ?? {};
    const start = (page - 1) * perPage;
    const end = start + perPage;

    const { data, headers } = await axiosClient.get(`/${resource}`, {
      params: {
        _start: start,
        _end: end,
        status: params.filter?.status,
      },
    });

    const contentRange = headers["content-range"] ?? "";
    const total = parseInt(contentRange.split("/")[1] ?? "0", 10);

    return { data, total };
  },

  getOne: async (resource: string, params: GetOneParams) => {
    const { data } = await axiosClient.get(`/${resource}/${params.id}`);
    return { data };
  },

  create: async (resource: string, params: CreateParams) => {
    const { data } = await axiosClient.post(`/${resource}`, params.data);
    return { data };
  },

  update: async (resource: string, params: UpdateParams) => {
    const { data } = await axiosClient.put(
      `/${resource}/${params.id}`,
      params.data,
    );
    return { data };
  },

  delete: async (resource: string, params: DeleteParams) => {
    const { data } = await axiosClient.delete(`/${resource}/${params.id}`);
    return { data };
  },

  getMany: async (resource: string, params) => {
    const responses = await Promise.all(
      params.ids.map((id) => axiosClient.get(`/${resource}/${id}`)),
    );
    return { data: responses.map((r) => r.data) };
  },

  getManyReference: async (resource: string, params) => {
    const { page = 1, perPage = 10 } = params.pagination ?? {};
    const start = (page - 1) * perPage;
    const end = start + perPage;

    const { data, headers } = await axiosClient.get(`/${resource}`, {
      params: {
        _start: start,
        _end: end,
        [params.target]: params.id,
      },
    });

    const contentRange = headers["content-range"] ?? "";
    const total = parseInt(contentRange.split("/")[1] ?? "0", 10);

    return { data, total };
  },

  updateMany: async (resource: string, params) => {
    await Promise.all(
      params.ids.map((id) =>
        axiosClient.put(`/${resource}/${id}`, params.data),
      ),
    );
    return { data: params.ids };
  },

  deleteMany: async (resource: string, params) => {
    await Promise.all(
      params.ids.map((id) => axiosClient.delete(`/${resource}/${id}`)),
    );
    return { data: params.ids };
  },
};
