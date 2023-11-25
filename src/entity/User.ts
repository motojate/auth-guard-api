import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('USER')
export class User {
  @PrimaryGeneratedColumn({ name: 'user_seq' })
  userSeq: string;

  @Column({ nullable: true })
  name?: string;

  @Column({ unique: true, name: 'user_id' })
  userId: string;
}
