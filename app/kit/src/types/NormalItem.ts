import { Bit, SourceType } from '@mcro/models'

export type NormalItem = {
  id?: string
  icon?: string
  title?: string
  type?: string
  subType?: string
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
  sourceType?: SourceType
  image?: string
  afterTitle?: React.ReactNode
  after?: React.ReactNode
}
