import { Global, Module } from '@nestjs/common';
import { KafkaService } from './kafka.service';
import { ClientKafka, ClientsModule, Transport } from '@nestjs/microservices';

@Global()
@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'auth-kafka',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'my-guard-auth',
            brokers: ['127.0.0.1:9092']
          },
          consumer: {
            groupId: 'my-guard-auth-group'
          }
        }
      }
    ])
  ],
  providers: [KafkaService, ClientKafka],
  exports: [KafkaService]
})
export class KafkaModule {}
