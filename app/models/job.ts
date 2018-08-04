import * as T from './typeorm'

@T.Entity()
export class Job extends T.BaseEntity {
  @T.PrimaryGeneratedColumn() id: number
  @T.Index()
  @T.Column()
  type: string
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
  @T.Index()
  @T.CreateDateColumn()
  createdAt: Date
  @T.Index()
  @T.UpdateDateColumn()
  updatedAt: Date

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
      where: { ...query, status: Job.statuses.PENDING },
      order: { createdAt: 'DESC' },
      take: 1,
    })
  }

  static lastCompleted(query?: Object) {
    return this.findOne({
      where: { ...query, status: Job.statuses.COMPLETE },
      order: { createdAt: 'DESC' },
      take: 1,
    })
  }

  static lastProcessing(query?: Object) {
    return this.findOne({
      where: { ...query, status: Job.statuses.PROCESSING },
      order: { createdAt: 'DESC' },
      take: 1,
    })
  }
}

