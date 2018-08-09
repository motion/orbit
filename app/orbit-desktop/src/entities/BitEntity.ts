import { Bit, SlackBitData, GmailBitData, IntegrationType, Setting, Person } from '@mcro/models'
import {
  BaseEntity,
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinTable,
  ManyToMany,
  ManyToOne, PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm'
import { hash } from '../helpers/createOrUpdateBit'
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

  @Column({ unique: true })
  contentHash: string

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
  data: SlackBitData | GmailBitData

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

  @ManyToMany(() => PersonEntity)
  @JoinTable()
  people: Person[]

  @ManyToOne(() => SettingEntity)
  setting: Setting

  @BeforeUpdate()
  @BeforeInsert()
  beforeInsert() {
    if (!this.contentHash) this.contentHash = hash(this.data)
  }

}
