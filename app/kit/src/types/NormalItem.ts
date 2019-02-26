import { Bit } from '@mcro/models'

export type NormalItem = {
  id?: string
  icon?: string
  title?: string
  type?: string
  subType?: string
  appIdentifier?: string
  preview?: React.ReactNode
  content?: any
  location?: string
  locationLink?: string
  webLink?: string
  desktopLink?: string
  createdAt?: Date
  updatedAt?: Date
  comments?: React.ReactNode[]
  people?: Bit[]
  searchTerm?: string
  subtitle?: React.ReactNode
  image?: string
  afterTitle?: React.ReactNode
  after?: React.ReactNode
}
