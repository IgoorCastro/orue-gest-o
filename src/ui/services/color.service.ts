import { Color, CreateColorDto } from "../types/color";
import { api } from "./api";
import { BaseService } from "./base.service";

export class ColorService extends BaseService<Color> {
  
  async create(data: CreateColorDto) {
    const resp = await api.post(this.endpoint, data);
    return resp.data;
  }

  update(id: string, data: Partial<CreateColorDto>) {
    return api.patch(`${this.endpoint}/${id}`, data);
  }

  delete(id: string) {
    return api.delete(`${this.endpoint}/${id}`);
  }

  restore(id: string) {
    return api.patch(`${this.endpoint}/${id}/restore`);
  }
}