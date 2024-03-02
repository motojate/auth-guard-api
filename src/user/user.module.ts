import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { AuthService } from 'src/auth/auth.service';
import { JwtService } from '@nestjs/jwt';
import { RedisCacheModule } from 'src/shared/redis/redis-cache.module';
import { GetValidUserIDHandler } from './queries/get-valid-user-id.handler';
import { UserCreateHandler } from './commands/user-create.handler';

@Module({
  imports: [RedisCacheModule],
  providers: [
    UserService,
    AuthService,
    JwtService,
    GetValidUserIDHandler,
    UserCreateHandler,
  ],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}
