import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

import { State } from '../interfaces/State'

@Entity()
export class StateEntity extends BaseEntity implements State {
  @PrimaryGeneratedColumn()
  id?: number

  @Column()
  identifier?: string

  @Column()
  type?: string

  @Column({ type: 'simple-json', default: '{}' })
  data?: State['data']
}
