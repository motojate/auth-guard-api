import { Entity, Column, OneToOne, PrimaryColumn, BeforeInsert } from 'typeorm';
import { RefreshToken } from '../../entity/RefreshToken';
import { v4 as uuidv4 } from 'uuid';

@Entity('USER')
export class User {
  @PrimaryColumn({ name: 'user_seq', type: 'uuid' })
  userSeq: string;

  @Column({ unique: true, name: 'user_id' })
  userId: string;

  @Column()
  password: string;

  @OneToOne(() => RefreshToken, (refreshToken) => refreshToken.user, {
    nullable: true,
  })
  refreshToken?: RefreshToken;

  @BeforeInsert()
  generateUserSeqByUuid() {
    if (!this.userSeq) this.userSeq = uuidv4();
  }
}
