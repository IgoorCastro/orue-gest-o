import { CreateStoreDto, Store } from "../types/store";
import { api } from "./api";
import { BaseService } from "./base.service";

export class StoreService extends BaseService<Store> {
    async create(data: CreateStoreDto) {
        const resp = await api.post(this.endpoint, data);
        return resp.data;
    }

    update(id: string, data: Partial<CreateStoreDto>) {
        return api.patch(`${this.endpoint}/${id}`, data);
    }

    delete(id: string) {
        return api.delete(`${this.endpoint}/${id}`);
    }

    restore(id: string) {
        return api.patch(`${this.endpoint}/${id}/restore`)
    }
}