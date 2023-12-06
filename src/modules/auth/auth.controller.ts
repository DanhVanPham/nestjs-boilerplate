import { Controller, Post, Body, UseGuards, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto } from './dto/sign-up.dto';
import { LocalAuthGuard } from './guards/local.guard';
import { RequestWithUser } from 'src/types/requests.type';
import { JwtRefreshTokenGuard } from './guards/jwt-refresh-token.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly auth_service: AuthService) {}

  @Post('sign-up')
  async signUp(@Body() sign_up_dto: SignUpDto) {
    return await this.auth_service.signUp(sign_up_dto);
  }

  @UseGuards(LocalAuthGuard)
  async signIn(@Req() request: RequestWithUser) {
    const { user } = request;
    return await this.auth_service.signIn(user._id.toString());
  }

  @UseGuards(JwtRefreshTokenGuard)
  @Post('refresh')
  async refreshAccessToken(@Req() request: RequestWithUser) {
    const { user } = request;

    const access_token = this.auth_service.generateAccessToken({
      id: user._id.toString(),
    });
    return {
      access_token,
    };
  }
}
