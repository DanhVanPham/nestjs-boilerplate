import { Inject, Injectable } from '@nestjs/common';
import { BaseServiceAbstract } from 'src/services/base/base.abstract.service';
import { User } from './entities/user.entity';
import { UserRepositoryInterface } from './interfaces/users.interface';
// import { UserRolesService } from '@modules/user-roles/user-roles.service';

@Injectable()
export class UsersService extends BaseServiceAbstract<User> {
  constructor(
    @Inject('UserRepositoryInterface')
    private readonly user_repository: UserRepositoryInterface,
    // private readonly user_roles_service: UserRolesService,
  ) {
    super(user_repository);
  }
  async create(create_dto: any): Promise<User> {
    // let user_role = await this.user_roles_service.findOne({
    //   name: USER_ROLE.USER,
    // });
    // if (!user_role) {
    //   user_role = await this.user_roles_service.create({
    //     name: USER_ROLE.USER,
    //   });
    // }
    const user = await this.user_repository.create({
      ...create_dto,
      // role: user_role,
    });
    return user;
  }

  async getUserWithRole(user_id: string): Promise<User> {
    try {
      return await this.user_repository.getUserWithRole(user_id);
    } catch (error) {
      throw error;
    }
  }

  async getUserByEmail(email: string): Promise<User> {
    const user = await this.user_repository.findOneByCondition({
      email,
    });
    return user;
  }

  async setCurrentRefreshToken(id: string, token: string): Promise<boolean> {
    return !!(await this.user_repository.update(id, {
      current_refresh_token: token,
    }));
  }
}
