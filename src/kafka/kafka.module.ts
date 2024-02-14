import { Global, Module } from '@nestjs/common';
import { KafkaService } from './kafka.service';
import { ClientKafka } from '@nestjs/microservices';

@Global()
@Module({
  providers: [KafkaService, ClientKafka],
  exports: [KafkaService],
})
export class KafkaModule {}
