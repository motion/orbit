import * as T from './typeorm'

@T.Entity()
export class Person extends T.BaseEntity {
  static identifyingKeys = ['identifier', 'integration']

  @T.PrimaryGeneratedColumn() id: number
  @T.Column({ unique: true })
  identifier: string
  @T.Column() integrationId: string
  @T.Column() integration: string
  @T.Column() name: string
  @T.CreateDateColumn() createdAt: Date
  @T.UpdateDateColumn() updatedAt: Date

  @T.Column('simple-json', { default: '{}' })
  data: {
    name: string
    email: string
    phone: string
    profile?: {
      image_48?: string
    }
  }
}
