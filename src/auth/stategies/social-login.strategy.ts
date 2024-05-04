import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { LoginAuthWithSocialDto } from '../dtos/auth.dto';
import { ILoginStrategy } from './login-strategy.inteface';
import { GetUserQuery } from 'src/user/queries/get-user.query';
import { User } from '@prisma/client';
import { UserCreateCommand } from 'src/user/commands/user-create.command';
import { Injectable } from '@nestjs/common';

@Injectable()
export class SocialLoginStrategy implements ILoginStrategy {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus,
  ) {}

  async authenticate(loginAuthDto: LoginAuthWithSocialDto): Promise<string> {
    const user = await this.queryBus.execute<GetUserQuery, User>(
      new GetUserQuery(loginAuthDto),
    );

    if (user) return user.userSeq;
    else return this.createUser(loginAuthDto);
  }

  private async createUser(dto: LoginAuthWithSocialDto): Promise<string> {
    const userSeq = await this.commandBus.execute<UserCreateCommand, string>(
      new UserCreateCommand({ password: null, ...dto }),
    );
    return userSeq;
  }
}
