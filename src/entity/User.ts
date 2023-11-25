import { Entity, PrimaryGeneratedColumn, Column, OneToOne } from 'typeorm';
import { RefreshToken } from './RefreshToken';

@Entity('USER')
export class User {
  @PrimaryGeneratedColumn({ name: 'user_seq' })
  userSeq: string;

  @Column({ unique: true, name: 'user_id' })
  userId: string;

  @Column()
  password: string;

  @OneToOne(() => RefreshToken, (refreshToken) => refreshToken.user)
  refreshToken: RefreshToken;
}
