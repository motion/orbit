import * as T from './typeorm'

@T.Entity()
export class Job extends T.BaseEntity {
  @T.PrimaryGeneratedColumn() id: number
  @T.Column() name: string
  @T.Column() status: string
  @T.CreateDateColumn createdAt: Date
  @T.UpdateDateColumn updatedAt: Date
}

T.setGlobal('Job', Job)
