import { AppBit } from '@o/kit'

export type ItemID = number | string

type ListItemFilter =
  | {
      type: 'recent-items'
      appId: number
      limit?: number
    }
  | {
      type: 'trending-items'
      appId: number
      limit?: number
    }

type BaseListItem = {
  id: ItemID
  name: string
  icon?: string
  filter?: ListItemFilter
}

export type ListAppDataItemFolder = BaseListItem & {
  type: 'folder' | 'root'
  children: ItemID[]
}

export type ListAppDataItem = ListAppDataItemFolder | BaseListItem & { type: 'bit' }

export type ListsAppData = {
  rootItemID: ItemID
  items: { [key in ItemID]: ListAppDataItem }
}

export type ListsAppBit = AppBit & { type: 'lists'; data: ListsAppData }
