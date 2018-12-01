import { Column, Entity, ManyToMany, OneToMany, PrimaryGeneratedColumn } from 'typeorm'
import { SourceEntity } from './SourceEntity'
import { AppEntity } from './AppEntity'
import { Space } from '../interfaces/Space'
import { Source } from '../interfaces/Source'

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

  @OneToMany(() => AppEntity, app => app.space)
  apps: Source[]
}
