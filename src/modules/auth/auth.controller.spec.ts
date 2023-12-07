// import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '@modules/users/users.service';
import { UsersRepository } from '@repositories/users.repository';
import { User } from '@modules/users/entities/user.entity';

describe('AuthController', () => {
  let controller: AuthController;

  beforeEach(async () => {
    controller = new AuthController(
      new AuthService(
        new ConfigService(),
        new JwtService(),
        new UsersService(new UsersRepository(User as any)),
      ),
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
