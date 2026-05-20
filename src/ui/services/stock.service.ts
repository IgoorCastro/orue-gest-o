import { CreateStockDto, Stock } from "../types/stock";
import { api } from "./api";
import { BaseService } from "./base.service";

export class StockService extends BaseService<Stock> {
  
  async create(data: CreateStockDto) {
    const resp = await api.post(this.endpoint, data);
    return resp.data;
  }

  update(id: string, data: Partial<CreateStockDto>) {
    return api.patch(`${this.endpoint}/${id}`, data);
  }

  delete(id: string) {
    return api.delete(`${this.endpoint}/${id}`);
  }

  restore(id: string) {
    return api.patch(`${this.endpoint}/${id}/restore`);
  }
}