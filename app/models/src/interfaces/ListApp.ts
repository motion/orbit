import { BaseApp } from './App'

export type ItemID = number | string

type ListItemFilter =
  | {
      type: 'recent-items'
      sourceId: number
      limit?: number
    }
  | {
      type: 'trending-items'
      sourceId: number
      limit?: number
    }

type BaseListItem = {
  id: ItemID
  name?: string
  icon?: string
  filter?: ListItemFilter
}

export type ListAppDataItemFolder = BaseListItem & {
  type: 'folder' | 'root'
  children: ItemID[]
}

export type ListAppDataItem = ListAppDataItemFolder | BaseListItem & { type: 'bit' | 'person' }

export type ListsAppData = {
  rootItemID: ItemID
  items: { [key in ItemID]: ListAppDataItem }
}

export type ListsApp = BaseApp & { type: 'lists'; data: ListsAppData }
