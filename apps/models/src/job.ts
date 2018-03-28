import {
  BaseEntity,
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  setGlobal,
} from './typeorm'

@Entity()
export class Job extends BaseEntity {
  @PrimaryGeneratedColumn() id: number

  @Column() name: string

  @Column({ nullable: true })
  birthdate: Date
}

setGlobal('Job', Job)
