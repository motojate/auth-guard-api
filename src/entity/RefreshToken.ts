import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { User } from './User';

@Entity('REFRESH_TOKEN')
export class RefreshToken {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  token: string;

  @OneToOne(() => User, (user) => user.refreshToken)
  @JoinColumn({ name: 'user_seq' })
  user: User;
}
