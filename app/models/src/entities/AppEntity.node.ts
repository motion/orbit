import { BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { Space } from '../interfaces/Space'
import { SpaceEntity } from './SpaceEntity.node'

@Entity()
export class AppEntity extends BaseEntity {
  target: 'app' = 'app'

  @PrimaryGeneratedColumn()
  id?: number

  @ManyToOne(() => SpaceEntity, space => space.sources)
  space?: Space

  @Column({ nullable: false })
  spaceId?: number

  @Column()
  name?: string

  @Column({ type: 'simple-json', default: '[]' })
  colors?: string[]

  @Column({ default: false })
  pinned?: boolean

  @Column()
  type?: string

  @Column('simple-json', { default: '{}' })
  data?: any
}
