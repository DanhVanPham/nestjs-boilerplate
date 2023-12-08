import { AuthService } from './auth.service';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '@modules/users/users.service';
import { UsersRepository } from '@repositories/users.repository';
import { User } from '@modules/users/entities/user.entity';

describe('AuthService', () => {
  const auth_service: AuthService = new AuthService(
    new ConfigService(),
    new JwtService(),
    new UsersService(new UsersRepository(User as any)),
  );

  // beforeEach(async () => {
  //   const module: TestingModule = await Test.createTestingModule({
  //     providers: [AuthService],
  //   }).compile();

  //   service = module.get<AuthService>(AuthService);
  // });

  it('should be defined', () => {
    expect(auth_service).toBeDefined();
  });
});
