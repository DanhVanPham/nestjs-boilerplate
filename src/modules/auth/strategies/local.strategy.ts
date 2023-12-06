import { UnauthorizedException, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '../auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, 'local') {
  constructor(private readonly auth_serive: AuthService) {
    super({ usernameField: 'email' }); // Mặc định là username, đổi sang email
  }

  async validate(email: string, password: string) {
    const user = this.auth_serive.getAuthenticatedUser(email, password);
    if (!user) throw new UnauthorizedException();

    return user;
  }
}
