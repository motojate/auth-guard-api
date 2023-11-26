import { Inject, Injectable } from '@nestjs/common';

import { SignUpMemberUser } from './dtos/user.dto';
import { generateHashedPassword } from 'src/shared/utils/password-hash.util';
import { PrismaService } from 'src/shared/prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: SignUpMemberUser) {
    try {
      const hashedPassword = await generateHashedPassword(dto.password);
      return this.prisma.user.create({
        data: {
          userId: dto.userId,
          password: hashedPassword,
        },
      });
    } catch (e) {}
  }
}
