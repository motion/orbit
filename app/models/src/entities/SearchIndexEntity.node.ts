import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

interface SearchIndex {
  id?: number
  title?: string
  body?: string
}

@Entity()
export class SearchIndexEntity extends BaseEntity implements SearchIndex {
  @PrimaryGeneratedColumn()
  id?: number

  @Column()
  title?: string

  @Column()
  body?: string
}
