type State = {
  navVisible: boolean
  navHovered: boolean
  share: { [key: string]: any }
}

export const state: State = {
  navVisible: false,
  navHovered: false,
  share: {},
}
