import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UserCreateCommand } from './user-create.command';
import { PrismaService } from 'src/shared/prisma/prisma.service';
import { generateHashedPassword } from 'src/shared/utils/password-hash.util';

@CommandHandler(UserCreateCommand)
export class UserCreateHandler implements ICommandHandler<UserCreateCommand> {
  constructor(private readonly prisma: PrismaService) {}

  async execute(command: UserCreateCommand): Promise<string> {
    const { userId, password, siteType, loginProvider } = command.userCreateDto;

    const hashedPassword = password
      ? await generateHashedPassword(password)
      : password;

    const user = await this.prisma.user.create({
      select: {
        userSeq: true,
      },
      data: {
        userId,
        password: hashedPassword,
        siteType,
        authProvider: loginProvider,
      },
    });

    return user.userSeq;
  }
}
