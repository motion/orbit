import * as T from './typeorm'

@T.Entity()
export class Bit extends T.BaseEntity {
  @T.PrimaryGeneratedColumn() id: number
  @T.Column() identifier: string
  @T.Column() integration: string
  @T.Column() title: string
  @T.Column() body: string
  @T.Column() type: string
  @T.Column({ nullable: true })
  author: string
  @T.Column({ nullable: true })
  url: string
  @T.Column('simple-json', { default: '{}' })
  data: Object
  // string is queryable
  @T.Column() bitCreatedAt: string
  @T.Column() bitUpdatedAt: string
  @T.CreateDateColumn() createdAt: Date
  @T.UpdateDateColumn() updatedAt: Date
}

T.setGlobal('Bit', Bit)
