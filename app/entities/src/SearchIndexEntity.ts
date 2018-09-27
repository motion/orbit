import { SearchIndex } from '@mcro/models'
import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity()
export class SearchIndexEntity extends BaseEntity implements SearchIndex {
  @PrimaryGeneratedColumn()
  id?: number

  @Column()
  title?: string

  @Column()
  body?: string
}
