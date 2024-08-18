import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { OAuth2Client } from 'google-auth-library';
import { UsersService } from '../users/users.service';
import { CodeService } from './utils/code.service';
import { MailService, TemplateTypeEnum } from './utils/mail.service';

@Injectable()
export class AuthService {
  private googleClient: OAuth2Client;

  constructor(
    private userService: UsersService,
    private codeService: CodeService,
    private mailService: MailService,
    private jwtService: JwtService,
  ) {
    this.googleClient = new OAuth2Client(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      'postmessage',
    );
  }

  async signUp(email: string) {
    const user = await this.userService.findByEmail(email);

    if (user) {
      throw new ConflictException('User already exists');
    }

    //TODO: deep-email-validator

    const newUser = await this.userService.create(email);

    const code = await this.codeService.generateCode(newUser.id);

    if (!code) {
      throw new InternalServerErrorException('Error generate code');
    }

    await this.mailService.sendMail(
      newUser.email,
      'Confirmation of authorisation in the spicy.pub',
      TemplateTypeEnum.emailSignUp,
      { code },
    );
  }

  async sendCode(email: string) {
    const user = await this.userService.findByEmail(email);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const code = await this.codeService.generateCode(user.id);

    if (!code) {
      throw new InternalServerErrorException('Error generate code');
    }

    await this.mailService.sendMail(
      user.email,
      'Confirmation of authorisation in the spicy.pub',
      TemplateTypeEnum.emailSignIn,
      { code },
    );
  }

  async verifyCode(email: string, code: string) {
    const user = await this.userService.findByEmail(email);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const isValid = await this.codeService.validateCode(user.id, code);

    if (!isValid) {
      throw new BadRequestException('Invalid or expired code');
    }

    const accessToken = await this.jwtService.signAsync({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    return { accessToken };
  }

  async verifyGoogleToken(code: string) {
    const { tokens } = await this.googleClient.getToken(code);
    const idToken = tokens.id_token;

    if (!idToken) {
      throw new Error('No ID token found');
    }

    const payload = this.jwtService.decode(idToken);

    if (!payload?.email) {
      throw new BadRequestException('Invalid Google token');
    }

    let user = await this.userService.findByEmail(payload.email);

    if (!user) {
      user = await this.userService.create(payload.email);
    }

    if (!user) {
      throw new Error('User not valid');
    }

    const accessToken = await this.jwtService.signAsync({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    return { accessToken };
  }
}
