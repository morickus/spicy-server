import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import * as process from 'node:process';
import { GetSessionInfoDto } from './dto/get-session-info.dto';
import { CookieService } from './utils/cookie.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  canActivate(context: ExecutionContext) {
    const req = context.switchToHttp().getRequest<Request>();
    const sessionInfo = this.getSessionInfo(req);

    if (!sessionInfo) {
      throw new UnauthorizedException();
    }

    req['session'] = sessionInfo;
    return true;
  }

  getSessionInfo(req: Request): GetSessionInfoDto | null {
    const token = req.cookies[CookieService.tokenKey];

    if (!token) {
      return null;
    }

    try {
      return this.jwtService.verify(token, {
        secret: process.env.JWT_SECRET,
      }) as GetSessionInfoDto;
    } catch {
      return null;
    }
  }
}
