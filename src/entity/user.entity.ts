/* eslint-disable prettier/prettier */

import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Parents } from "./parents.entity";
import { Point } from "./point.entity";

@Entity("user", { schema: "typeorm" })
export class User {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("tinyint", { name: "grade", nullable: true })
  grade: number | null;

  @Column("tinyint", { name: "class", nullable: true })
  classNum: number | null;

  @Column("smallint", { name: "number", nullable: true })
  number: number | null;

  @Column("varchar", { name: "name", length: 10 })
  name: string;

  @Column("char", { name: "phone", length: 11 })
  phone: string;

  @Column("varchar", { name: "account", length: 10 })
  account: string;

  @Column("char", { name: "password", length: 64 })
  password: string;

  @Column("tinyint", { name: "permission" })
  permission: number;

  @Column("varchar", { name: "salt", length: 10 })
  salt: string;

  @OneToMany(() => Parents, (parents) => parents.user, { cascade: true })
  parents: Parents[];

  @OneToMany(() => Point, (point) => point.user, { cascade: true })
  points: Point[];

  static id: any;
  static grade: any;
  static classNum: any;
}
