import * as T from './typeorm'
import { Person } from './person'

@T.Entity()
export class Bit extends T.BaseEntity {
  static identifyingKeys = ['identifier', 'type', 'integration']

  @T.PrimaryGeneratedColumn() id: number
  @T.Column({ unique: true })
  identifier: string
  @T.Column() integration: string
  @T.Index()
  @T.Column()
  title: string
  // row used for filtering: slack room, github repo, google doc folder, etc
  @T.Index()
  @T.Column({ nullable: true })
  location: string
  @T.Column() body: string
  @T.Index()
  @T.Column()
  type: string
  @T.Column() bitCreatedAt: string
  @T.Column() bitUpdatedAt: string
  @T.Index()
  @T.CreateDateColumn()
  createdAt: Date
  @T.Index()
  @T.UpdateDateColumn()
  updatedAt: Date

  @T.Column({ nullable: true })
  author: string

  @T.Column({ nullable: true })
  url: string

  @T.Column('simple-json', { default: '{}' })
  data: Object

  @T.ManyToMany(_ => Person)
  @T.JoinTable()
  people: Person[]
}

T.setGlobal('Bit', Bit)
