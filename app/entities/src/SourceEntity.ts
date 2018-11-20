import { Space } from '@mcro/models'
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity, JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'
import { SpaceEntity } from './SpaceEntity'

@Entity()
export class SourceEntity extends BaseEntity {
  target: 'source' = 'source'

  @PrimaryGeneratedColumn()
  id?: number

  @ManyToMany(() => SpaceEntity, space => space.sources)
  @JoinTable()
  spaces?: Space[]

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
