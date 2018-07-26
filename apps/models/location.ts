import * as T from './typeorm'

export class Location {

  @T.Column({ nullable: true })
  id: string

  @T.Column({ nullable: true })
  name: string

  @T.Column({ nullable: true })
  webLink: string

  @T.Column({ nullable: true })
  desktopLink: string

}

