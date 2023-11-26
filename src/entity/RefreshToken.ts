import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../user/entities/user.entity';

@Entity('REFRESH_TOKEN')
export class RefreshToken {
  @PrimaryGeneratedColumn()
  readonly id: number;

  @Column({ unique: true })
  readonly token: string;

  @OneToOne(() => User, (user) => user.refreshToken)
  @JoinColumn({ name: 'user_seq' })
  readonly user: User;
}
