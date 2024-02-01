import { Controller, Get } from '@nestjs/common';
import { PrismaService } from './shared/prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Controller()
export class AppController {}
