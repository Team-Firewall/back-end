/* eslint-disable prettier/prettier */
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User{
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int', nullable: true })
  grade: number;
  
  @Column({ type: 'int', nullable: true })
  class: number;
  
  @Column({ type: 'int', nullable: true })
  number: number;
  
  @Column({ type: 'varchar', length: 10, nullable: false })
  name: string;
  
  @Column({ type: 'varchar', length: 11, nullable: false, unique: true })
  phone: string;
  
  @Column({ type: 'varchar', length: 30, nullable: false })
  account: string;
  
  @Column({ type: 'char', length: 64, nullable: false })
  password: string;
  
  @Column({ default: 2 })
  position: Role;

  @Column({ type: 'varchar', length: 10, nullable: false })
  salt: string
}

enum Role {
  ADMIN,
  H_TEACHER,
  M_TEACHER,
  H_STUDENT,
  M_STUDENT
}
