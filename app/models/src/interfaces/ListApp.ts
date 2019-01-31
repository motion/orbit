import { BaseApp } from './App'

export type ItemID = number | string

export type ListAppDataItem =
  | {
      id: ItemID
      type: 'folder' | 'root'
      name?: string
      children: ItemID[]
      icon?: string
    }
  | {
      id: ItemID
      type: 'bit' | 'person'
      name?: string
      icon?: string
    }

export type ListsAppData = {
  rootItemID: ItemID
  items: { [key in ItemID]: ListAppDataItem }
}

export type ListsApp = BaseApp & { type: 'lists'; data: ListsAppData }
