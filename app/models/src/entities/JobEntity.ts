import { BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { SourceEntity } from './SourceEntity'
import { Job } from '../interfaces/Job'
import { JobType } from '../interfaces/JobType'
import { JobStatus } from '../interfaces/JobStatus'
import { Source } from '../interfaces/Source'

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
  sourceId?: number

  @ManyToOne(() => SourceEntity)
  source?: Source
}
