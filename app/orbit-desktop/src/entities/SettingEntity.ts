import { ConfluenceSettingValues, IntegrationType, JiraSettingValues, Setting, SettingValues } from '@mcro/models'
import { BaseEntity, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm'

@Entity()
export class SettingEntity extends BaseEntity implements Setting {

  target: 'setting' = 'setting'

  @PrimaryGeneratedColumn()
  id: number

  @Column({ nullable: true, unique: true })
  identifier: string

  @Column()
  category: string

  @Column()
  type: 'general' | IntegrationType

  @Column({ nullable: true })
  token: string

  @Column('simple-json', { default: '{}' })
  values: SettingValues

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date

}
