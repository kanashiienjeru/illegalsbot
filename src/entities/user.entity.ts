import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Gang } from "./gang.entity";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number

  @Column("varchar")
  name: string

  @Column("integer")
  vk: number

  @Column("integer", { default: 0 })
  level: number

  @Column("integer", { default: 0 })
  active: number

  @Column("boolean", { nullable: true })
  isLeader: boolean

  @Column("boolean", { nullable: true })
  isDeputy: boolean

  @ManyToOne(() => Gang, (gang) => gang.id, { nullable: true })
  @JoinColumn()
  gang: Gang
}