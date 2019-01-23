import { Column, Entity, ManyToMany, OneToMany, PrimaryGeneratedColumn } from 'typeorm'
import { Source } from '../interfaces/Source'
import { Space } from '../interfaces/Space'
import { AppEntity } from './AppEntity.node'
import { SourceEntity } from './SourceEntity.node'

@Entity()
export class SpaceEntity implements Space {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  name: string

  @Column({ type: 'simple-json' })
  colors: string[]

  @ManyToMany(() => SourceEntity, source => source.spaces)
  sources: Source[]

  @Column({ type: 'simple-json' })
  paneSort: number[]

  @OneToMany(() => AppEntity, app => app.space)
  apps: Source[]
}
