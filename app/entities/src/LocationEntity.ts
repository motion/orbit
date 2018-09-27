import { Location } from '@mcro/models'
import { Column } from 'typeorm'

export class LocationEntity implements Location {

  @Column({ nullable: true })
  id?: string

  @Column({ nullable: true })
  name?: string

  @Column({ nullable: true })
  webLink?: string

  @Column({ nullable: true })
  desktopLink?: string

}
