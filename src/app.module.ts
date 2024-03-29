import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { PrismaModule } from './shared/prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { RedisModule } from '@liaoliaots/nestjs-redis';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RedisCacheModule } from './shared/redis/redis-cache.module';
import { CustomCqrsModule } from './shared/cqrs/custom-cqrs.module';
import { KafkaModule } from './kafka/kafka.module';

@Module({
  imports: [
    RedisModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        config: {
          host: configService.get('REDIS_HOST'),
          port: configService.get('REDIS_PORT'),
        },
      }),
      inject: [ConfigService],
    }),
    UserModule,
    PrismaModule,
    AuthModule,
    //KafkaModule,
    RedisCacheModule,
    CustomCqrsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
