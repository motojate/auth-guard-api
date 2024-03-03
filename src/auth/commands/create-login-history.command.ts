import { ICommand } from '@nestjs/cqrs';

export class CreateLoginHistoryCommand implements ICommand {
  constructor(public readonly userSeq: string) {}
}
