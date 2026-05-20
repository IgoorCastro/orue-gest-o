import { api } from "./api";

export type BaseResponse<T> = {
    data: T[];
};

export class BaseService<T> {
    constructor(protected endpoint: string) { }

    async findAll(params?: any): Promise<T[]> {
        const { data } = await api.get(this.endpoint, { params });
        return data;
    }

    async findById(id: string): Promise<T> {
        const { data } = await api.get(`${this.endpoint}/${id}`);
        return data;
    }
}