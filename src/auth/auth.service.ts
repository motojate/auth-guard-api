import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { PrismaService } from 'src/shared/prisma/prisma.service';
import { UserService } from 'src/user/user.service';
import { LoginAuthDto } from './dtos/auth.dto';
import * as bcrypt from 'bcrypt';
import { InvalidUserException } from 'src/shared/exceptions/user.exception';

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
    const token = this.jwtService.sign({ seq: userSeq }, { expiresIn: '30d' });
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
    return this.jwtService.verify(token);
  }

  async OAuthLogin({ req, res }) {
    console.log(req, res);
    // 1. 회원조회
    // const user = await this.userService.findUniqueByUserIdAndSiteType(); //user를 찾아서

    // // 2, 회원가입이 안되어있다면? 자동회원가입
    // if (!user) user = await this.userService.create({ ...req.user }); //user가 없으면 하나 만들고, 있으면 이 if문에 들어오지 않을거기때문에 이러나 저러나 user는 존재하는게 됨.

    // // 3. 회원가입이 되어있다면? 로그인(AT, RT를 생성해서 브라우저에 전송)한다
    // this.setRefreshToken({ user, res });
    // res.redirect('리다이렉트할 url주소');
  }
}
