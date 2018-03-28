import {
  BaseEntity,
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
} from './typeorm'
// import global from 'global'

@Entity()
export class Job extends BaseEntity {
  @PrimaryGeneratedColumn() id: number

  @Column() name: string

  @Column({ nullable: true })
  birthdate: Date
}

if (typeof global === 'undefined') {
  eval(`window.Job = Job`)
}
