import { ResolvableModel } from '../sources/types'

export type SelectionGroup = {
  name?: string
  shouldAutoSelect?: boolean
  indices: number[]
  items?: ResolvableModel[] // optionally store full items...
  type: 'row' | 'column'
  startIndex?: number
  [key: string]: any
}
