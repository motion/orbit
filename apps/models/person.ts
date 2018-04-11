import * as T from './typeorm'

@T.Entity()
export class Person extends T.BaseEntity {
  static identifyingKeys = ['identifier']

  @T.PrimaryGeneratedColumn() id: number
  @T.Column() identifier: string
  @T.Column() name: string
  @T.Column('simple-json', { default: '{}' })
  data: {
    name: string
    email: string
    phone: string
  }
  @T.CreateDateColumn() createdAt: Date
  @T.UpdateDateColumn() updatedAt: Date
}

T.setGlobal('Person', Person)
