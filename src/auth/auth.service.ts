import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { PrismaService } from 'src/shared/prisma/prisma.service';
import { UserService } from 'src/user/user.service';
import { LoginAuthDto } from './dtos/auth.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
    private readonly userService: UserService,
  ) {}

  async createToken(user: User): Promise<string> {
    const payload = { userSeq: user.userSeq };
    return this.jwtService.sign(payload);
  }

  async validateUser(loginAuthDto: LoginAuthDto) {
    const user = await this.userService.findUniqueByUserIdAndSiteType(
      loginAuthDto,
    );
    if (!user) {
      throw new UnauthorizedException('Invalid userId');
    }
    const isValidPassword = await bcrypt.compare(
      loginAuthDto.password,
      user.user.password,
    );
    if (!isValidPassword) {
      throw new UnauthorizedException('Invalid password');
    }
    return user;
  }

  async login(user: User) {
    const payload = {
      userSeq: user.userSeq,
    };
    const refreshToken = await this.createRefreshToken(user.userSeq);
    return {
      access_token: this.jwtService.sign(payload),
      refresh_token: refreshToken,
    };
  }

  private async createRefreshToken(userSeq: string): Promise<string> {
    const token = this.jwtService.sign({ seq: userSeq }, { expiresIn: '30d' });
    await this.prisma.refreshToken.create({
      data: { token, userSeq },
    });
    return token;
  }

  async findRefreshToken(token: string) {
    return this.prisma.refreshToken.findUnique({ where: { token } });
  }

  async revokeRefreshToken(token: string) {
    await this.prisma.refreshToken.update({
      where: { token },
      data: { isRevoked: true },
    });
  }

  async verifyToken(token: string): Promise<any> {
    return this.jwtService.verify(token);
  }
}
