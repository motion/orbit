import * as T from './typeorm'
import { Person } from './person'

@T.Entity()
export class Bit extends T.BaseEntity {
  static identifyingKeys = ['identifier', 'type', 'integration']

  @T.PrimaryGeneratedColumn() id: number
  @T.Column() identifier: string
  @T.Column() integration: string
  @T.Column() title: string
  @T.Column() body: string
  @T.Column() type: string
  @T.Column() bitCreatedAt: string
  @T.Column() bitUpdatedAt: string
  @T.CreateDateColumn() createdAt: Date
  @T.UpdateDateColumn() updatedAt: Date

  @T.Column({ nullable: true })
  author: string

  @T.Column({ nullable: true })
  url: string

  @T.Column('simple-json', { default: '{}' })
  data: Object

  @T.ManyToMany(type => Person)
  @T.JoinTable()
  people: Person[]
}

T.setGlobal('Bit', Bit)
