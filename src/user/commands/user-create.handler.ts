import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UserCreateCommand } from './user-create.command';
import { PrismaService } from 'src/shared/prisma/prisma.service';
import { generateHashedPassword } from 'src/shared/utils/password-hash.util';

@CommandHandler(UserCreateCommand)
export class UserCreateHandler implements ICommandHandler<UserCreateCommand> {
  constructor(private readonly prisma: PrismaService) {}

  async execute(command: UserCreateCommand): Promise<void> {
    const hashedPassword = await generateHashedPassword(command.password);
    await this.prisma.user.create({
      data: {
        password: hashedPassword,
        sites: {
          create: {
            userId: command.userId,
            siteName: command.siteType,
            authProvider: 'LOCAL',
          },
        },
      },
    });
  }
}
