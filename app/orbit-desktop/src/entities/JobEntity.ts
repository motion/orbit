import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'
import { Job } from '@mcro/models'

@Entity()
export class JobEntity extends BaseEntity implements Job {

  target: 'job' = 'job'

  @PrimaryGeneratedColumn()
  id: number

  @Index()
  @Column()
  type: string

  @Column()
  action: string

  @Column({ nullable: true })
  lastError: string

  @Column({
    default: 'PENDING',
  })
  status: string

  @Column({ default: 0 })
  tries: number

  @Column({ default: 0 })
  percent: number

  @Index()
  @CreateDateColumn()
  createdAt: Date

  @Index()
  @UpdateDateColumn()
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
      where: { ...query, status: JobEntity.statuses.PENDING },
      order: { createdAt: 'DESC' },
      take: 1,
    } as any)
  }

  static lastCompleted(query?: Object) {
    return this.findOne({
      where: { ...query, status: JobEntity.statuses.COMPLETE },
      order: { createdAt: 'DESC' },
      take: 1,
    } as any)
  }

  static lastProcessing(query?: Object) {
    return this.findOne({
      where: { ...query, status: JobEntity.statuses.PROCESSING },
      order: { createdAt: 'DESC' },
      take: 1,
    } as any)
  }
}
