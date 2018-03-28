import * as T from './typeorm'

@T.Entity()
export class Job extends T.BaseEntity {
  @T.PrimaryGeneratedColumn() id: number

  @T.Column() name: string

  @T.Column({ nullable: true })
  birthdate: Date
}

T.setGlobal('Job', Job)
