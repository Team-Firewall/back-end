/* eslint-disable prettier/prettier */
import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity()
export class Regulate {

@PrimaryColumn()
id: number;

@Column({ nullable: false })
regulate: string;

@Column({ type: 'int', nullable: false })
score: number;

@Column({ nullable: false })
checked: boolean;

}