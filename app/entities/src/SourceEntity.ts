import { Space } from '@mcro/models/_'
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity, ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'
import { SpaceEntity } from './SpaceEntity'

@Entity()
export class SourceEntity extends BaseEntity {
  target: 'source' = 'source'

  @PrimaryGeneratedColumn()
  id?: number

  @ManyToOne(() => SpaceEntity, space => space.sources)
  space?: Space

  @Column({ nullable: false })
  spaceId?: number

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
