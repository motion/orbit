import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'
import { User } from '../interfaces/User'

@Entity()
export class UserEntity implements User {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  name: string

  @Column({ unique: true, nullable: true })
  email: string

  @Column({ nullable: true })
  cloudId: string

  @Column({ nullable: true })
  lastTimeSync: number

  @Column()
  activeSpace: number

  @Column({ type: 'simple-json' })
  spaceConfig: User['spaceConfig']

  @Column({ type: 'simple-json' })
  settings: User['settings']

  @Column({ type: 'simple-json' })
  appState: User['appState']
}
