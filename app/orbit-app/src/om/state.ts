export type ShareItem = {
  id: number
  name: string
  identifier: string
  items: any[]
}

type State = {
  navVisible: boolean
  navHovered: boolean
  share: {
    [id: string]: ShareItem
  }
}

export const state: State = {
  navVisible: false,
  navHovered: false,
  share: {},
}
