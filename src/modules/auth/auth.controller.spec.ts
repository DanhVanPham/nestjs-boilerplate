// import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { Test, TestingModule } from '@nestjs/testing';
import { mock_request_with_user } from './test/mocks/request.mock';
import {
  mock_access_token,
  mock_refresh_token,
} from './test/mocks/tokens-mock';
import { isGuarded } from 'src/shared/test/utils';
import { LocalAuthGuard } from './guards/local.guard';

describe('AuthController', () => {
  let auth_controller: AuthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [AuthService],
    }).compile();

    auth_controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(auth_controller).toBeDefined();
  });
  it('should be protected with LocalAuthGuard', () => {
    expect(isGuarded(AuthController.prototype.signIn, LocalAuthGuard));
  });
  describe('signIn', () => {
    it('should sign in a user and return an access token', async () => {
      // Arrange

      // Act
      const response = await auth_controller.signIn(mock_request_with_user);

      // Assert
      expect(response).toEqual({
        access_token: mock_access_token,
        refresh_token: mock_refresh_token,
      });
    });
  });
});
