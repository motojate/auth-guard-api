import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateLoginHistoryCommand } from './create-login-history.command';

@CommandHandler(CreateLoginHistoryCommand)
export class CreateLoginHistoryHandler
  implements ICommandHandler<CreateLoginHistoryCommand>
{
  execute(command: CreateLoginHistoryCommand): Promise<any> {
    throw new Error('Method not implemented.');
  }
}
