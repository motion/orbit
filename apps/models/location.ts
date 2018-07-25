import * as T from './typeorm'

export class Location {

  @T.Column({ nullable: true })
  id: string

  @T.Column({ nullable: true })
  url: string

  @T.Column({ nullable: true })
  name: string

}

