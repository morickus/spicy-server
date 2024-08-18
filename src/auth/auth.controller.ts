import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBody,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Response } from 'express';
import { AuthGuard } from './auth.guard';
import { AuthService } from './auth.service';
import { GetSessionInfoDto } from './dto/get-session-info.dto';
import { SendCodeDto } from './dto/send-code.dto';
import { SignUpDto } from './dto/sign-up.dto';
import { VerifyCodeDto } from './dto/verify-code.dto';
import { CookieService } from './utils/cookie.service';
import { SessionInfo } from './utils/session-info.decorator';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private cookieService: CookieService,
  ) {}

  @Post('sign-up')
  @ApiCreatedResponse()
  async signUp(@Body() body: SignUpDto) {
    return await this.authService.signUp(body.email);
  }

  @Post('send-code')
  @ApiOkResponse()
  @HttpCode(HttpStatus.OK)
  async sendCode(@Body() body: SendCodeDto) {
    await this.authService.sendCode(body.email);
  }

  @Post('verify-code')
  @ApiOkResponse()
  @HttpCode(HttpStatus.OK)
  async verifyCode(
    @Body() body: VerifyCodeDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { accessToken } = await this.authService.verifyCode(
      body.email,
      body.code,
    );

    this.cookieService.setToken(res, accessToken);
  }

  @Post('google')
  @ApiOkResponse()
  @HttpCode(HttpStatus.OK)
  @ApiBody({
    schema: { type: 'object', properties: { code: { type: 'string' } } },
  })
  async googleAuth(
    @Body('code') code: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { accessToken } = await this.authService.verifyGoogleToken(code);

    this.cookieService.setToken(res, accessToken);
  }

  @Post('sign-out')
  @ApiOkResponse()
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
  signOut(@Res({ passthrough: true }) res: Response) {
    this.cookieService.removeToken(res);
  }

  @Get('session')
  @ApiOkResponse({
    type: GetSessionInfoDto,
  })
  @UseGuards(AuthGuard)
  getSessionInfo(@SessionInfo() session: GetSessionInfoDto) {
    return session;
  }
}
