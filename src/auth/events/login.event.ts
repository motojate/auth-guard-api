import { IEvent } from '@nestjs/cqrs';

export class LoginEvent implements IEvent {
  constructor(public readonly userSeq: string) {}
}
