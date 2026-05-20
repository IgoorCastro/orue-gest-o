import { CreateUserDto, User } from "../types/user";
import { api } from "./api";
import { BaseService } from "./base.service";

export class UserService extends BaseService<User> {
    async create(data: CreateUserDto) {
        const resp = await api.post(this.endpoint, data);
        return resp.data;
    }

    update(id: string, data: Partial<CreateUserDto>) {
        return api.patch(`${this.endpoint}/${id}`, data);
    }

    delete(id: string) {
        return api.delete(`${this.endpoint}/${id}`);
    }

    restore(id: string) {
        return api.patch(`${this.endpoint}/${id}/restore`);
    }
}