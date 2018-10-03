import { Job, JobStatus, JobType, Setting } from '@mcro/models'
import { BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { SettingEntity } from './SettingEntity'

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
  settingId?: number

  @ManyToOne(() => SettingEntity)
  setting?: Setting

}
