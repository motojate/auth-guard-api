import { IQuery } from '@nestjs/cqrs';
import { LoginAuthDto } from 'src/auth/dtos/auth.dto';

export class GetUserQuery implements IQuery {
  constructor(
    public readonly loginAuthDto?: LoginAuthDto,
    public readonly userSeq?: string,
  ) {}
}
