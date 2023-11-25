import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  userSeq: string;

  @Column({ nullable: true })
  name?: string;

  @Column({ unique: true })
  userId: string;
}
