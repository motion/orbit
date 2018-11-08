import { Space } from '@mcro/models'
import { BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { SpaceEntity } from './SpaceEntity'

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

  @Column()
  type?: string

  @Column('simple-json', { default: '{}' })
  values?: any

}
