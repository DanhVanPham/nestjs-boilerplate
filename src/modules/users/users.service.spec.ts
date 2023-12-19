import { Test, TestingModule } from '@nestjs/testing';
import { createMock } from '@golevelup/ts-jest';
import { UsersService } from './users.service';
import { UsersRepository } from '@repositories/users.repository';
import { UserRolesService } from '@modules/user-roles/user-roles.service';
import { UserRepositoryInterface } from './interfaces/users.interface';
import { ConfigService } from '@nestjs/config';
import { createUserStub } from './test/stubs/user.stub';
import { DailyCheckInService } from '@modules/daily-check-in/daily-check-in.service';
import { User } from './entities/user.entity';

describe('UsersService', () => {
  let user_service: UsersService;
  let user_repository: UsersRepository;
  let daily_check_in_service: DailyCheckInService;

  beforeEach(async () => {
    const module_ref: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        UserRolesService,
        {
          provide: 'UsersRepositoryInterface',
          useValue: createMock<UserRepositoryInterface>(),
        },
        {
          provide: ConfigService,
          useValue: createMock<ConfigService>(),
        },
        {
          provide: DailyCheckInService,
          useValue: createMock<DailyCheckInService>(),
        },
      ],
    }).compile();

    user_service = module_ref.get<UsersService>(UsersService);
    user_repository = module_ref.get('UsersRepositoryInterface');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(user_service).toBeDefined();
  });

  describe('Daily Check-in', () => {
    describe('Case 1: User never check in before', () => {
      it('should receive reward if it is last day of month (case 1.1)', async () => {
        // Arrange
        const user = createUserStub();
        const testing_date = '2023-01-31';
        const check_in_time = new Date(testing_date);
        const check_in_data = [
          {
            eligible_for_reward: true,
            checked_date: check_in_time.toDateString(),
          },
        ];

        // Act
        await user_service.updateDailyCheckIn(user, testing_date);

        // Assert
        expect(daily_check_in_service.create).toHaveBeenCalledWith({
          user,
          month_year: `${
            check_in_time.getMonth() + 1
          }-${check_in_time.getFullYear()}`,
          check_in_data,
        });
        expect(user_repository.update).toHaveBeenCalledWith(user._id, {
          point: user.point + 1,
          last_check_in: check_in_time,
          last_get_check_in_rewards: check_in_time,
          daily_check_in: check_in_data,
        });
      });
      it('it should create check-in date record if it is not the last day of month (case 1.2)', async () => {
        // Arrange
        const check_in_date = new Date('2023-01-15 12:12:12');
        const user = createUserStub();
        const check_in_data = [
          {
            eligible_for_reward: false,
            checked_date: check_in_date.toDateString(),
          },
        ];

        // Act
        await user_service.updateDailyCheckIn(
          user,
          check_in_date.toLocaleDateString(),
        );

        // Assert
        expect(user_repository.update).toHaveBeenCalledWith(user._id, {
          last_check_in: check_in_date,
          daily_check_in: check_in_data,
        });
        expect(daily_check_in_service.create).toHaveBeenCalledWith({
          user,
          month_year: `${
            check_in_date.getMonth() + 1
          }-${check_in_date.getFullYear()}`,
          check_in_data,
        });
      });
    });
    describe('Case 2.2: The day to check-in has not checked in yet', () => {
      describe('Case 2.2.1: The day to check-in is the last day of month', () => {
        it('should receive reward for both of month if the month before has not got reward (case 2.2.1.1)', async () => {
          // Arrange
          const user = {
            ...createUserStub(),
            daily_check_in: [
              {
                checked_date: new Date('2023-01-10'),
                eligible_for_reward: false,
                access_amount: 1,
                reward_days_count: 1,
              },
              {
                checked_date: new Date('2023-01-15'),
                eligible_for_reward: false,
                access_amount: 1,
                reward_days_count: 2,
              },
            ],
            last_check_in: new Date('2023-01-15 07:00:00'),
            last_get_check_in_rewards: new Date('2022-12-31 09:00:00'),
          } as unknown as User;
          const testing_date = '2023-02-28 15:00:00';
          const check_in_date = new Date(testing_date);

          // Act
          await user_service.updateDailyCheckIn(user, testing_date);

          // Assert
          expect(user_repository.update).toHaveBeenCalledWith(
            user._id.toString(),
            {
              last_check_in: check_in_date,
              last_get_check_in_rewards: check_in_date,
              point: user.point + 3,
              daily_check_in: [
                ...user.daily_check_in,
                {
                  checked_date: check_in_date,
                  eligible_for_reward: true,
                },
              ],
            },
          );
        });
      });
    });
  });
});
