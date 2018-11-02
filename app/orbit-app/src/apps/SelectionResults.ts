import { ResolvableModel } from '../integrations/types'

export type SelectionGroup = {
  name?: string
  shouldAutoSelect?: boolean
  ids: number[]
  items?: ResolvableModel[] // optionally store full items...
  type: 'row' | 'column'
  startIndex?: number
  [key: string]: any
}
