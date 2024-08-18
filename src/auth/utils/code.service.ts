import { Injectable } from '@nestjs/common';
import { addMinutes } from 'date-fns';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CodeService {
  constructor(private prisma: PrismaService) {}

  private generateSixDigitCode(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  async generateCode(userId: number): Promise<string> {
    const code = this.generateSixDigitCode();
    const expiresAt = addMinutes(new Date(), 15);

    await this.prisma.authCode.create({
      data: {
        userId,
        code,
        expiresAt,
      },
    });

    return code;
  }

  async validateCode(userId: number, code: string): Promise<boolean> {
    const authCode = await this.prisma.authCode.findFirst({
      where: {
        userId,
        code,
        expiresAt: {
          gt: new Date(),
        },
        activatedAt: null,
      },
    });

    if (!authCode) {
      return false;
    }

    await this.prisma.authCode.update({
      where: { id: authCode.id },
      data: { activatedAt: new Date() },
    });

    return true;
  }
}
