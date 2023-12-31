import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { PrismaService } from 'src/shared/prisma/prisma.service';
import { UserService } from 'src/user/user.service';
import { LoginAuthDto, LoginAuthWithSocialDto } from './dtos/auth.dto';
import * as bcrypt from 'bcrypt';
import { InvalidUserException } from 'src/shared/exceptions/user.exception';
import { IOAuthGoogleUser } from 'src/shared/interfaces/OAuth.interface';
import { decode } from 'jsonwebtoken';
@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
    private readonly userService: UserService,
  ) {}

  async decodeToken(token: string) {
    try {
      const decoded = decode(token, { complete: false });
      return decoded;
    } catch (e) {
      return null;
    }
  }

  async createToken(user: User): Promise<string> {
    const payload = { userSeq: user.userSeq };
    return this.jwtService.sign(payload);
  }

  async validateUser(loginAuthDto: LoginAuthDto) {
    const dto: LoginAuthWithSocialDto = {
      loginProvider: loginAuthDto.loginProvider,
      userId: loginAuthDto.userId,
      siteType: loginAuthDto.siteType,
    };
    const user = await this.userService.findUniqueByUserIdAndSiteType(dto);
    if (!user) throw new InvalidUserException();

    const isValidPassword = await bcrypt.compare(
      loginAuthDto.password,
      user.user.password,
    );
    if (!isValidPassword) {
      throw new UnauthorizedException('Invalid password');
    }
    return user;
  }

  async login(userSeq: string) {
    const payload = {
      userSeq: userSeq,
    };
    const refreshToken = await this.createRefreshToken(userSeq);
    return {
      access_token: this.jwtService.sign(payload),
      refresh_token: refreshToken,
    };
  }

  private async createRefreshToken(userSeq: string): Promise<string> {
    const token = this.jwtService.sign(
      { userSeq: userSeq },
      { expiresIn: '30d' },
    );
    await this.prisma.refreshToken.upsert({
      where: {
        userSeq: userSeq,
      },
      create: {
        token,
        userSeq,
      },
      update: {
        token,
      },
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
    try {
      return await this.jwtService.verify(token);
    } catch (e) {
      console.log(1);
    }
  }

  async OAuthLogin(googleOAuthUser: IOAuthGoogleUser) {
    const dto: LoginAuthWithSocialDto = {
      userId: googleOAuthUser.email,
      siteType: googleOAuthUser.site,
      loginProvider: 'GOOGLE',
    };

    const user = await this.userService.findUniqueByUserIdAndSiteType(dto);
    if (user) return user;
    else {
      return this.userService.createBySocial(dto);
    }
  }
}
