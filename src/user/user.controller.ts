import { Body, Controller, Get, HttpCode, Post, Query } from '@nestjs/common';
import { UserService } from './user.service';
import {
  CheckAvailabilityUserIdDto,
  SignUpMemberUserDto,
} from './dtos/user.dto';
import { AuthProvider, SiteType } from '@prisma/client';
import { GetValidUserIdQuery } from './queries/get-valid-user-id.query';
import { QueryBus } from '@nestjs/cqrs';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly queryBus: QueryBus,
  ) {}

  @Post('create')
  async signUp(@Body() singUpMemberUser: SignUpMemberUserDto) {
    return this.userService.create(singUpMemberUser);
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
