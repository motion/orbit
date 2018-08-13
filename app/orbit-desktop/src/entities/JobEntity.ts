import { Job, JobStatus, IntegrationType } from '@mcro/models'
import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity()
export class JobEntity extends BaseEntity implements Job {

  target: 'job' = 'job'

  @PrimaryGeneratedColumn()
  id: number

  @Column()
  syncer: string

  @Column({ nullable: true })
  integration: IntegrationType

  @Column()
  time: number

  @Column()
  status: JobStatus

  @Column()
  message: string

}
