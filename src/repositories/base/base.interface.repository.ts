import { FindAllResponse } from 'src/types/common.type';

export interface BaseRepositoryInterface<T> {
    create(dto: T | null): Promise<T>;
}
