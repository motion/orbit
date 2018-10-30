import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'

@Entity()
export class SettingEntity extends BaseEntity {
  target: 'setting' = 'setting'

  @PrimaryGeneratedColumn()
  id?: number

  @Column({ nullable: true, unique: true })
  identifier?: string

  @Column()
  name?: string

  @Column()
  category?: string

  @Column('varchar')
  type?: any

  @Column({ nullable: true })
  token?: string

  @Column('simple-json', { default: '{}' })
  values?: any

  @CreateDateColumn()
  createdAt?: Date

  @UpdateDateColumn()
  updatedAt?: Date
}
