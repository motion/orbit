import { Job, JobStatus, Setting } from '@mcro/models'
import { BaseEntity, Column, Entity, PrimaryGeneratedColumn, ManyToOne } from 'typeorm'
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
  status?: JobStatus

  @Column()
  message?: string

  @Column({ nullable: true })
  settingId?: number

  @ManyToOne(() => SettingEntity)
  setting?: Setting

}
