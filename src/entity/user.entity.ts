/* eslint-disable prettier/prettier */

import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Parents } from "./parents.entity";
import { Point } from "./point.entity";

@Entity("user", { schema: "typeorm" })
export class User {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("int", { name: "grade", nullable: true })
  grade: number | null;

  @Column("int", { name: "class", nullable: true })
  classNum: number | null;

  @Column("int", { name: "number", nullable: true })
  number: number | null;

  @Column("varchar", { name: "name", length: 10 })
  name: string;

  @Column("varchar", { name: "phone", length: 11 })
  phone: string;

  @Column("varchar", { name: "account", length: 30 })
  account: string;

  @Column("char", { name: "password", length: 64 })
  password: string;

  @Column("tinyint", { name: "position" })
  position: number;

  @Column("varchar", { name: "salt", length: 10 })
  salt: string;

  @OneToMany(() => Parents, (parents) => parents.user)
  parents: Parents[];

  @OneToMany(() => Point, (point) => point.user, { cascade: true })
  points: Point[];

  static id: any;
  static grade: any;
  static classNum: any;
}
