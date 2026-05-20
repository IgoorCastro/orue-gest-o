// base service generica para finds

import { PaginatedResponse } from "../types/paginated-response";
import { api } from "./api";

export class BaseServicePaginated<T> {
  constructor(protected endpoint: string) {}

  async findAll(params?: any): Promise<PaginatedResponse<T>> {
    const { data } = await api.get(this.endpoint, { params });
    return data;
  }

  async findById(id: string): Promise<T> {
    const { data } = await api.get(`${this.endpoint}/${id}`);
    return data;
  }
}