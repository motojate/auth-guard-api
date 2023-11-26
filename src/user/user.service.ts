import { Injectable } from '@nestjs/common';
import { SignUpMemberUser } from './dtos/user.dto';
import { generateHashedPassword } from 'src/shared/utils/password-hash.util';
import { PrismaService } from 'src/shared/prisma/prisma.service';
import { PrismaException } from 'src/shared/exceptions/prisma.exception';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: SignUpMemberUser) {
    try {
      const hashedPassword = await generateHashedPassword(dto.password);
      const user = await this.prisma.user.create({
        data: {
          userId: dto.userId,
          password: hashedPassword,
        },
      });
      return user;
    } catch (e) {
      throw new PrismaException();
    }
  }
}
