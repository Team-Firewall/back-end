/* eslint-disable prettier/prettier */
import { Entity, Column, PrimaryGeneratedColumn, OneToMany, JoinColumn } from 'typeorm';
import { User } from './user.entity';
import { Regulate } from './regulate.entity';
import { CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class Point {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int', default: false })
  checked: boolean;

  @Column({ type: 'int', nullable: false })
  point: number;

  @Column({ nullable: true })
  reason: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn({ nullable: true, onUpdate: 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @OneToMany(() => User, (user) => user.id)
  @JoinColumn({ name: 'userId' })
  userId: number
  user: User[]

  @OneToMany(() => Regulate, (regulate) => regulate.id)
  @JoinColumn({ name: 'regulateId' })
  regulate: Regulate[]
}