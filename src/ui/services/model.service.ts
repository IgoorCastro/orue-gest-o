import { CreateModelDto, Model } from "../types/model";
import { api } from "./api";
import { BaseService } from "./base.service";

export class ModelService extends BaseService<Model> {
  
  async create(data: CreateModelDto) {
    const resp = await api.post(this.endpoint, data);
    return resp.data;
  }

  update(id: string, data: Partial<CreateModelDto>) {
    return api.patch(`${this.endpoint}/${id}`, data);
  }

  delete(id: string) {
    return api.delete(`${this.endpoint}/${id}`);
  }

  restore(id: string) {
    return api.patch(`${this.endpoint}/${id}/restore`);
  }
}