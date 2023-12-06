import { UsersService } from '@modules/users/users.service';
import {
  Injectable,
  ConflictException,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { SignUpDto } from './dto/sign-up.dto';
import * as bcrypt from 'bcryptjs';
import { User } from '@modules/users/entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { FindAllResponse } from 'src/types/common.type';
import {
  access_token_private_key,
  refresh_token_private_key,
} from 'src/constraints/jwt.constraint';

type TokenPayload = {
  id: string;
};

@Injectable()
export class AuthService {
  private SALT_ROUND = 11;
  constructor(
    private readonly config_service: ConfigService,
    private readonly jwt_service: JwtService,
    private readonly users_service: UsersService,
  ) {}

  async signUp(sign_up_dto: SignUpDto) {
    try {
      const existed_user = this.users_service.findOneByCondition({
        email: sign_up_dto.email,
      });
      if (existed_user) throw new ConflictException('Email already existed!');

      const hashed_password = await bcrypt.hashSync(
        sign_up_dto.password,
        this.SALT_ROUND,
      );
      const user = await this.users_service.create({
        ...sign_up_dto,
        username: `${sign_up_dto.email.split('@')[0]}${Math.floor(
          10 + Math.random() * (999 - 10),
        )}`, // Random username
        password: hashed_password,
      });

      const refresh_token = this.generateRefreshToken({
        id: user._id.toString(),
      });
      await this.storeRefreshToken(user._id.toString(), refresh_token);
      return {
        access_token: this.generateAccessToken({
          id: user._id.toString(),
        }),
        refresh_token,
      };
    } catch (error) {
      throw error;
    }
  }

  async signIn(id: string) {
    try {
      const accessToken = this.generateAccessToken({ id });
      const refresh_token = this.generateRefreshToken({ id });
      await this.storeRefreshToken(id, refresh_token);
      return {
        accessToken,
        refresh_token,
      };
    } catch (error) {
      throw error;
    }
  }

  async getUserIfRefreshTokenMatched(
    user_id: string,
    refresh_token: string,
  ): Promise<User> {
    try {
      const user = await this.users_service.findOne(user_id);
      if (!user) throw new UnauthorizedException();
      await this.verifyPlainContentWithHashedContent(
        refresh_token,
        user.current_refresh_token,
      );
      return user;
    } catch (error) {
      throw error;
    }
  }

  async storeRefreshToken(user_id: string, token: string) {
    try {
      const hashed_token = bcrypt.hashSync(token, this.SALT_ROUND);
      await this.users_service.setCurrentRefreshToken(user_id, hashed_token);
    } catch (error) {
      throw error;
    }
  }

  generateAccessToken(payload: TokenPayload) {
    return this.jwt_service.sign(payload, {
      algorithm: 'RS256',
      privateKey: access_token_private_key,
      // secret: 'access_token_secret',
      expiresIn: `${this.config_service.get<string>(
        'JWT_ACCESS_TOKEN_EXPIRATION_TIME',
      )}s`,
    });
  }

  generateRefreshToken(payload: TokenPayload) {
    return this.jwt_service.sign(payload, {
      // secret: 'refresh_token_secret',
      algorithm: 'RS256',
      privateKey: refresh_token_private_key,
      expiresIn: `${this.config_service.get<string>(
        'JWT_REFRESH_TOKEN_EXPIRATION_TIME',
      )}s`,
    });
  }

  async findAll(): Promise<FindAllResponse<User>> {
    return await this.users_service.findAll();
  }

  async getAuthenticatedUser(email: string, password: string): Promise<User> {
    try {
      const user = await this.users_service.getUserByEmail(email);
      await this.verifyPlainContentWithHashedContent(password, user.password);
      return user;
    } catch (error) {
      throw new BadRequestException('Wrong credentials!!');
    }
  }

  private async verifyPlainContentWithHashedContent(
    plain_text: string,
    hashed_text: string,
  ) {
    const is_matching = bcrypt.compareSync(plain_text, hashed_text);
    if (!is_matching) throw new BadRequestException();
  }
}
