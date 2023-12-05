import { Injectable } from '@nestjs/common';
import { User } from '@modules/users/entities/user.entity';
import { UserRepositoryInterface } from '@modules/users/interfaces/users.interface';
import { BaseRepositoryAbstract } from './base/base.abstract.repository';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class UsersRepository
  extends BaseRepositoryAbstract<User>
  implements UserRepositoryInterface
{
  constructor(
    @InjectModel(User.name)
    private readonly user_repository: Model<User>,
  ) {
    super(user_repository);
  }
}
