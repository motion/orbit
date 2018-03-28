import * as T from './typeorm'

@T.Entity()
export class Setting extends T.BaseEntity {
  @T.PrimaryGeneratedColumn() id: number
  @T.Column() type: string
  @T.Column('simple-json') values: {}
  @T.CreateDateColumn createdAt: Date
  @T.UpdateDateColumn updatedAt: Date
}

T.setGlobal('Setting', Setting)
