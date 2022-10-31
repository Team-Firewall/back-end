/* eslint-disable prettier/prettier */
import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { User } from "./user.entity";

@Index("FK_User_TO_Parents_1", ["userid"], {})
@Entity("parents", { schema: "typeorm" })
export class Parents {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("int", { name: "userid" })
  userid: number;

  @Column("varchar", { name: "phone", length: 11 })
  phone: string;

  @ManyToOne(() => User, (user) => user.parents, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "userid", referencedColumnName: "id" }])
  user: User;
}
