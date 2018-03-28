import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from './typeorm'
import global from 'global'

@Entity()
export class Job {
  @PrimaryGeneratedColumn() id: number

  @Column() name: string

  @Column({ nullable: true })
  birthdate: Date
}

if (typeof window !== 'undefined') {
  eval(`window.Job = Job`)
}
