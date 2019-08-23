import { BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'

import { AppBit } from '../AppBit'
import { Job } from '../Job'
import { JobStatus } from '../JobStatus'
import { JobType } from '../JobType'
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
