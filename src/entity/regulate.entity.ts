/* eslint-disable prettier/prettier */
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Point } from "./point.entity";

@Entity("regulate", { schema: "typeorm" })
export class Regulate {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("tinyint", { name: "checked" })
  checked: number;

  @Column("varchar", { name: "regulate", length: 50 })
  regulate: string;

  @Column("int", { name: "score" })
  score: number;

  @OneToMany(() => Point, (point) => point.regulate)
  points: Point[];
}