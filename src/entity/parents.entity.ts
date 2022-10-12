/* eslint-disable prettier/prettier */
import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn, } from 'typeorm';
import { User } from './user.entity';

@Entity()
export class Parents {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  phone: string;

  @Column()
  userId: number;

  @OneToOne(() => User, (user) => user.id)
  @JoinColumn({ name: 'userId' })
  user: User;
}