import { Bit, BitData, IntegrationType, Person, Setting } from '@mcro/models'
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm'
import { LocationEntity } from './LocationEntity'
import { PersonEntity } from './PersonEntity'
import { SettingEntity } from './SettingEntity'

@Entity()
export class BitEntity extends BaseEntity implements Bit {
  target: 'bit' = 'bit'

  @PrimaryColumn()
  id?: number

  @Index()
  @Column({ unique: true })
  contentHash?: number

  @Column({ type: String })
  integration?: IntegrationType

  @Column()
  settingId?: number

  @Column({ nullable: true })
  authorId?: number

  @Index()
  @Column()
  title?: string

  @Column()
  body?: string

  @Index()
  @Column()
  type?: string

  @Column({ nullable: true })
  webLink?: string

  @Column({ nullable: true })
  desktopLink?: string

  @Column({ type: 'simple-json', default: '{}' })
  data?: BitData

  @Column({ type: 'simple-json', default: '{}' })
  raw?: any

  @Column(() => LocationEntity)
  location?: LocationEntity

  @Column()
  bitCreatedAt?: number

  @Column()
  bitUpdatedAt?: number

  @Index()
  @CreateDateColumn()
  createdAt?: Date

  @Index()
  @UpdateDateColumn()
  updatedAt?: Date

  @ManyToOne(() => PersonEntity)
  author?: Person

  @ManyToMany(() => PersonEntity, person => person.bits)
  @JoinTable()
  people?: Person[]

  @ManyToOne(() => SettingEntity)
  setting?: Setting
}
