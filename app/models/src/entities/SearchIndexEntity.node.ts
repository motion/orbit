import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm'
import { SearchIndex } from '../interfaces/SearchIndex'

@Entity()
export class SearchIndexEntity extends BaseEntity implements SearchIndex {
  @PrimaryGeneratedColumn()
  id?: number

  @Column()
  title?: string

  @Column()
  body?: string
}
