import { LoginAuthWithPasswordDto } from '../dtos/auth.dto';
import { ILoginStrategy } from './login-strategy.inteface';
import { QueryBus } from '@nestjs/cqrs';
import { GetUserQuery } from 'src/user/queries/get-user.query';
import * as bcrypt from 'bcrypt';
import { InvalidUserException } from 'src/shared/exceptions/user.exception';
import { User } from '@prisma/client';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PasswordLoginStrategy implements ILoginStrategy {
  constructor(private readonly queryBus: QueryBus) {}

  async authenticate(loginAuthDto: LoginAuthWithPasswordDto): Promise<string> {
    const { password, ...dto } = loginAuthDto;
    const user = await this.queryBus.execute<GetUserQuery, User>(
      new GetUserQuery(dto),
    );
    if (!user) throw new InvalidUserException();
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) throw new InvalidUserException();
    return user.userSeq;
  }
}
