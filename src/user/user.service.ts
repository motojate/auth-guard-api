import { Inject, Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { SignUpMemberUser } from './dtos/user.dto';
import { generateHashedPassword } from 'src/utils/password-hash.util';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async create(dto: SignUpMemberUser) {
    try {
      const user = new User();
      user.userId = dto.userId;
      user.password = await generateHashedPassword(dto.password);
      return this.userRepository.save(user);
    } catch (e) {}
  }
}
