export type SelectionGroup = {
  name?: string
  shouldAutoSelect?: boolean
  indices: number[]
  items?: any[] // optionally store full items...
  type: 'row' | 'column'
  startIndex?: number
  [key: string]: any
}
