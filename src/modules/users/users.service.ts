import { Inject, Injectable } from '@nestjs/common';
import { BaseServiceAbstract } from 'src/services/base/base.abstract.service';
import { User } from './entities/user.entity';
import { UserRepositoryInterface } from './interfaces/users.interface';
import { ConfigService } from '@nestjs/config';
import { isLastDayOfMonth } from 'src/shared/helpers/date.helper';
// import { UserRolesService } from '@modules/user-roles/user-roles.service';

@Injectable()
export class UsersService extends BaseServiceAbstract<User> {
  constructor(
    @Inject('UserRepositoryInterface')
    private readonly user_repository: UserRepositoryInterface,
    private readonly config: ConfigService,
  ) {
    // private readonly user_roles_service: UserRolesService,
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

  async updateDailyCheckIn(
    user: User,
    date_for_testing?: string,
  ): Promise<User> {
    // Assuming with all the rewards of this API: corresponding to one check-in day will get one point
    const check_in_time =
      this.config.get('NODE_ENV') === 'production'
        ? new Date()
        : new Date(date_for_testing);

    const { daily_check_in } = user;
    // Case 1
    if (!daily_check_in?.length) {
      // Case 1.1
      if (isLastDayOfMonth(check_in_time)) {
        return await this.user_repository.update(user._id.toString(), {
          point: user.point + 1,
          daily_check_in: [
            { eligible_for_reward: true, checked_date: check_in_time },
          ],
          last_check_in: check_in_time,
          last_get_check_in_rewards: check_in_time,
        });
      }
    }

    const is_last_date_of_month =
      check_in_time.getDate() === last_day_of_check_in_month;
    // TH1:
    if (is_last_date_of_month) {
      return await this.user_repository.update(user._id, {
        point: user.point + 1,
        daily_check_in: [
          { eligible_for_reward: true, checked_date: check_in_time },
        ],
        last_check_in: check_in_time,
        last_get_check_in_rewards: check_in_time,
      });
    }

    const already_check_in_index = daily_check_in.findIndex(
      (check_in_data) =>
        check_in_data.checked_date.toDateString() ===
        check_in_time.toDateString(),
    );
    // TH 2.1
    if (already_check_in_index !== -1) {
      return;
    } // Lưu ý: theo thứ tự thì các bạn phải có logic cho phần này trước
    // TH 2.2
    // TH 2.2.1
    if (isLastDayOfMonth(check_in_time)) {
      //TH 2.2.1.1
      if (
        (user.last_get_check_in_rewards.getMonth() !==
          user.last_check_in.getMonth() ||
          user.last_get_check_in_rewards.getFullYear() !==
            user.last_check_in.getFullYear()) &&
        (user.last_check_in.getFullYear() !== check_in_time.getFullYear() ||
          user.last_check_in.getMonth() !== check_in_time.getMonth())
      ) {
        const {
          previous_month_data,
          current_month_data,
        } = daily_check_in.reduce(
          (result, check_in_data) => {
            if (
              check_in_data.checked_date.getFullYear() ===
                user.last_check_in.getFullYear() &&
              check_in_data.checked_date.getMonth() ===
                user.last_check_in.getMonth()
            ) {
              return {
                ...result,
                previous_month_data: [
                  ...result.previous_month_data,
                  check_in_data,
                ],
              };
            }
            if (
              check_in_data.checked_date.getFullYear() ===
                check_in_time.getFullYear() &&
              check_in_data.checked_date.getMonth() === check_in_time.getMonth()
            ) {
              return {
                ...result,
                current_month_data: [
                  ...result.current_month_data,
                  check_in_data,
                ],
              };
            }
          },
          {
            previous_month_data: [],
            current_month_data: [],
          },
        );
        const previous_month_point = previous_month_data.length;
        const current_month_point = current_month_data.length + 1; // One more point for the day has just checked-in
        return await this.user_repository.update(user._id.toString(), {
          last_check_in: check_in_time,
          last_get_check_in_rewards: check_in_time,
          daily_check_in: [
            ...daily_check_in,
            {
              eligible_for_reward: true,
              checked_date: check_in_time,
            },
          ],
          point: user.point + previous_month_point + current_month_point,
        });
      }
    }
  }
}
