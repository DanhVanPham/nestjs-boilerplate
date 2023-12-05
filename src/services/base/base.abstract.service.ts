import { BaseEntity } from '@modules/shared/base/base.entity';
import { BaseServiceInterface } from './base.interface.service';
import { FindAllResponse } from 'src/types/common.type';
import { BaseRepositoryInterface } from '@repositories/base/base.interface.repository';

export abstract class BaseServiceAbstract<T extends BaseEntity>
  implements BaseServiceInterface<T>
{
  constructor(private readonly repository: BaseRepositoryInterface<T>) {}

  async create(item: any): Promise<T> {
    return await this.repository.create(item);
  }

  async findAll(
    filter?: object,
    options?: object,
  ): Promise<FindAllResponse<T>> {
    return await this.repository.findAll(filter, options);
  }

  async findOne(id: string): Promise<T> {
    return await this.repository.findOneById(id);
  }

  async update(id: string, update_dto: Partial<T>): Promise<T> {
    return await this.repository.update(id, update_dto);
  }

  async remove(id: string): Promise<boolean> {
    return await this.repository.softDelete(id);
  }
}
