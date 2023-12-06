import { Injectable } from '@nestjs/common';
import { User } from '@modules/users/entities/user.entity';
import { UserRepositoryInterface } from '@modules/users/interfaces/users.interface';
import { BaseRepositoryAbstract } from './base/base.abstract.repository';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserRole } from '@modules/user-roles/entities/user-role.entity';

@Injectable()
export class UsersRepository
  extends BaseRepositoryAbstract<User>
  implements UserRepositoryInterface
{
  constructor(
    @InjectModel(User.name)
    private readonly user_model: Model<User>,
  ) {
    super(user_model);
  }

  async getUserWithRole(user_id: string): Promise<User> {
    return await this.user_model
      .findById(user_id, '-password')
      .populate([{ path: 'role', transform: (role: UserRole) => role?.name }]);
  }
}
