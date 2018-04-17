import * as T from './typeorm'

@T.Entity()
export class Job extends T.BaseEntity {
  @T.PrimaryGeneratedColumn() id: number
  @T.Column() type: string
  @T.Column() action: string
  @T.Column({ nullable: true })
  lastError: string
  @T.Column({
    default: 'PENDING',
  })
  status: string
  @T.Column({ default: 0 })
  tries: number
  @T.Column({ default: 0 })
  percent: number
  @T.CreateDateColumn() createdAt: Date
  @T.UpdateDateColumn() updatedAt: Date

  get lock() {
    return `${this.type}`
  }

  static statuses = {
    PENDING: 'PENDING',
    FAILED: 'FAILED',
    PROCESSING: 'PROCESSING',
    COMPLETE: 'COMPLETE',
  }

  static lastPending(query?: Object) {
    return this.findOne({
      where: { ...query, status: 'pending' },
      order: { createdAt: 'DESC' },
      take: 1,
    })
  }

  static lastCompleted(query?: Object) {
    return this.findOne({
      where: { ...query, status: 'completed' },
      order: { createdAt: 'DESC' },
      take: 1,
    })
  }
}

T.setGlobal('Job', Job)
