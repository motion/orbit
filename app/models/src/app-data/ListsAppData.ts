export type ListsAppDataListItem = {
  name: string
  pinned: boolean
  order: number
  bits: {
    id: number
    order: number
  }[]
}

export type ListsAppData = {
  lists: ListsAppDataListItem[]
}
