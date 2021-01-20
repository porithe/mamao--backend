import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Injectable } from '@nestjs/common';

interface IPayload {
  user: {
    uuid: string;
    username: string;
    email: string;
    password: string;
    description: string | null;
    avatar: string | null;
    following: null;
    followers: null;
    createdAt: Date;
    updatedAt: Date;
  },
  sub: string;
  iat: number;
  exp: number;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate(payload: IPayload) {
    return { uuid: payload.sub, username: payload.user.username };
  }
}
