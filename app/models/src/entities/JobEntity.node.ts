import { BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { AppBit } from '../interfaces/AppBit'
import { Job } from '../interfaces/Job'
import { JobStatus } from '../interfaces/JobStatus'
import { JobType } from '../interfaces/JobType'
import { AppEntity } from './AppEntity.node'

@Entity()
export class JobEntity extends BaseEntity implements Job {
  target: 'job' = 'job'

  @PrimaryGeneratedColumn()
  id?: number

  @Column()
  syncer?: string

  @Column()
  time?: number

  @Column({ type: String })
  type?: JobType

  @Column({ type: String })
  status?: JobStatus

  @Column()
  message?: string

  @Column({ nullable: true })
  appId?: number

  @ManyToOne(() => AppEntity)
  app?: AppBit
}
