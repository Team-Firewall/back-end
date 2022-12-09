/* eslint-disable prettier/prettier */
import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Regulate } from "./regulate.entity";
import { User } from "./user.entity";

@Index("FK_User_TO_Point_1", ["userId"], {})
@Index("FK_Regulate_TO_Point_1", ["regulateId"], {})
@Entity("point", { schema: "typeorm" })
export class Point {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("int", { name: "userId" })
  userId: number;

  @Column("int", { name: "regulateId" })
  regulateId: number;

  @Column("varchar", { name: "reason", nullable: true, length: 100 })
  reason: string | null;
  
  @Column("varchar", { name: "issuer", length: 10 })
  issuer: string;

  @Column("datetime", { name: "createdAt", default: () => "CURRENT_TIMESTAMP" })
  createdAt: Date;

  @Column("datetime", { name: "updatedAt", default: () => "CURRENT_TIMESTAMP" ,onUpdate: "CURRENT_TIMESTAMP"})
  updatedAt: Date;

  @ManyToOne(() => Regulate, (regulate) => regulate.points, {
    onDelete: 'CASCADE',
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "regulateId", referencedColumnName: "id" }])
  regulate: Regulate;

  @ManyToOne(() => User, (user) => user.points, {
    onDelete: 'CASCADE',
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "userId", referencedColumnName: "id" }])
  user: User;
}
