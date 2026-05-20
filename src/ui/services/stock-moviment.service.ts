import { CreateStockMovimentDto, StockMoviment } from "../types/stock-moviment";
import { api } from "./api";
import { BaseService } from "./base.service";
import { PaginatedResponse } from "../types/paginated-response";

export class StockMovimentService extends BaseService<StockMoviment> {
  
  async create(data: CreateStockMovimentDto) {
    const resp = await api.post(this.endpoint, data);
    return resp.data;
  }

  update(id: string, data: Partial<CreateStockMovimentDto>) {
    return api.put(`${this.endpoint}/${id}`, data);
  }

  delete(id: string) {
    return api.delete(`${this.endpoint}/${id}`);
  }

  // Método específico para buscar com filtros (retorna resposta paginada)
  async findWithFilters(params?: any): Promise<PaginatedResponse<StockMoviment>> {
    const { data } = await api.get(this.endpoint, { params });
    return data;
  }
}