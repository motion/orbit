export type TransportRequestType =
  | 'unsubscribe'
  | 'command'
  | 'save'
  | 'remove'
  | 'loadOne'
  | 'loadMany'
  | 'loadManyAndCount'
  | 'loadCount'
  | 'observeOne'
  | 'observeMany'
  | 'observeManyAndCount'
  | 'observeCount'

export type TransportRequestValues = {
  command?: string
  model?: string
  args?: { [key: string]: any }
  resolvers?: { [key: string]: any }
  value?: any
}

export type TransportRequest = {
  id: string
  type: TransportRequestType
} & TransportRequestValues

export type TransportResponse = {
  id: string
  result: any
  notFound?: boolean
}
