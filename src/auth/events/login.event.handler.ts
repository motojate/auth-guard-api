import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { LoginEvent } from './login.event';
import { PrismaService } from 'src/shared/prisma/prisma.service';

@EventsHandler(LoginEvent)
export class LoginEventHandler implements IEventHandler<LoginEvent> {
  constructor(private readonly prisma: PrismaService) {}
  async handle(event: LoginEvent): Promise<void> {
    await this.prisma.loginHistory.create({
      data: {
        userSeq: event.userSeq,
      },
    });
  }
}
