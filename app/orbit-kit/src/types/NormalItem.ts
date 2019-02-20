import { IntegrationType, Person } from '@mcro/models'

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
  people?: Person[]
  searchTerm?: string
  subtitle?: React.ReactNode
  integration?: IntegrationType
  image?: string
  afterTitle?: React.ReactNode
  after?: React.ReactNode
}
