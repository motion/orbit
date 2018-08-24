import {
  Bit,
  BitData,
  ConfluenceBitData,
  GmailBitData,
  IntegrationType,
  JiraBitData,
  Person,
  Setting,
  SlackBitData,
} from '@mcro/models'
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
  id: string

  @Column({ type: String })
  integration: IntegrationType

  @Index()
  @Column()
  title: string

  @Column()
  body: string

  @Index()
  @Column()
  type: string

  @Column({ nullable: true })
  webLink: string

  @Column({ nullable: true })
  desktopLink: string

  @Column({ nullable: true })
  settingId: number

  @Column({ type: 'simple-json', default: '{}' })
  data: BitData

  @Column({ type: 'simple-json', default: '{}' })
  raw: any

  @Column(() => LocationEntity)
  location: LocationEntity

  @Column()
  bitCreatedAt: number

  @Column()
  bitUpdatedAt: number

  @Index()
  @CreateDateColumn()
  createdAt: Date

  @Index()
  @UpdateDateColumn()
  updatedAt: Date

  @ManyToOne(() => PersonEntity)
  author: Person

  @ManyToMany(() => PersonEntity)
  @JoinTable()
  people: Person[]

  @ManyToOne(() => SettingEntity)
  setting: Setting

}