import { Body, Controller, Get, HttpCode, Post, Query } from '@nestjs/common';
import {
  CheckAvailabilityUserIdDto,
  SignUpMemberUserDto,
} from './dtos/user.dto';
import { GetValidUserIdQuery } from './queries/get-valid-user-id.query';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { UserCreateCommand } from './commands/user-create.command';

@Controller('user')
export class UserController {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus,
  ) {}

  @Post('join')
  async signUp(@Body() singUpMemberUser: SignUpMemberUserDto) {
    const userSeq = await this.commandBus.execute<UserCreateCommand, string>(
      new UserCreateCommand({ loginProvider: 'LOCAL', ...singUpMemberUser }),
    );
    return userSeq;
  }

  @Get('check/availability')
  @HttpCode(200)
  async isavailAbilityUserId(
    @Query() checkAvailabilityUserIdDto: CheckAvailabilityUserIdDto,
  ) {
    return this.queryBus.execute(
      new GetValidUserIdQuery(
        checkAvailabilityUserIdDto.userId,
        checkAvailabilityUserIdDto.siteName,
        checkAvailabilityUserIdDto.authProvider,
      ),
    );
  }
}
