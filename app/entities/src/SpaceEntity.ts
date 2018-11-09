import { Space, Source } from '@mcro/models'
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm'
import { SourceEntity } from './SourceEntity'
import { AppEntity } from './AppEntity'

@Entity()
export class SpaceEntity implements Space {

  @PrimaryGeneratedColumn()
  id: number

  @Column()
  name: string

  @Column({ type: 'simple-json' })
  colors: string[]

  @OneToMany(() => SourceEntity, source => source.space)
  sources: Source[]

  @OneToMany(() => AppEntity, app => app.space)
  apps: Source[]

}
