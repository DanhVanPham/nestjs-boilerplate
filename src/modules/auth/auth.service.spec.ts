import { AuthService } from './auth.service';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { UsersService } from '@modules/users/users.service';
import { UsersRepository } from '@repositories/users.repository';
import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { User } from '@modules/users/entities/user.entity';
import { mockConfigService } from './test/mocks/config-service.mock';
import { mockJwtService } from './test/mocks/jwt.mock';
import { createUserStub } from '@modules/users/test/stubs/user.stub';
import { ConflictException } from '@nestjs/common';
import { SignUpDto } from './dto/sign-up.dto';
import {
  mock_access_token,
  mock_refresh_token,
} from './test/mocks/tokens-mock';

jest.mock('../../users/users.service');
describe('AuthService', () => {
  let auth_service: AuthService;
  let user_service: UsersService;
  // let jwt_service: JwtService;
  //  = new AuthService(
  //   new ConfigService(),
  //   new JwtService(),
  //   new UsersService(new UsersRepository(User as any)),
  // );

  beforeEach(async () => {
    const module_ref: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: 'UserRepositoryInterface',
          useClass: UsersRepository,
        },
        {
          provide: getModelToken(User.name),
          useValue: {},
        },
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    auth_service = module_ref.get<AuthService>(AuthService);
    user_service = module_ref.get<UsersService>(UsersService);
    // jwt_service = module_ref.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(auth_service).toBeDefined();
  });

  describe('signUp', () => {
    it('should throw a ConflictException if user with email already exists', async () => {
      // Arrange
      jest
        .spyOn(user_service, 'findOneByCondition')
        .mockResolvedValueOnce(createUserStub());

      // Action & Assert
      await expect(auth_service.signUp(createUserStub())).rejects.toThrow(
        ConflictException,
      );
    });
    it('should successfully create and return a new user, if email is not taken', async () => {
      // Arrange
      const user_stub = createUserStub();
      const mock_sign_up_dto: SignUpDto = {
        email: 'michaelsmith@gmail.com',
        first_name: 'Michael',
        last_name: 'Smith',
        password: '1231e$$321',
      };
      jest
        .spyOn(user_service, 'findOneByCondition')
        .mockResolvedValueOnce(null);
      jest
        .spyOn(auth_service, 'generateAccessToken')
        .mockReturnValue(mock_access_token);
      jest
        .spyOn(bcrypt, 'hash')
        .mockImplementationOnce(() => mock_sign_up_dto.password);
      jest.spyOn(auth_service, 'storeRefreshToken');

      // Act
      const result = await auth_service.signUp(mock_sign_up_dto);

      // Assert
      expect(user_service.create).toHaveBeenCalledWith({
        ...mock_sign_up_dto,
        username: expect.any(String),
      });
      expect(auth_service.generateRefreshToken).toHaveBeenCalledWith({
        id: user_stub._id,
      });
      expect(auth_service.storeRefreshToken).toHaveBeenCalledWith({
        id: user_stub._id,
      });
      expect(result).toEqual({
        access_token: mock_access_token,
        refresh_token: mock_refresh_token,
      });
    });
  });
});
