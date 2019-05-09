import { Action } from 'overmind'

export const setNavVisible: Action<boolean> = ({ state }, x) => {
  state.navVisible = x
}

export const setNavHovered: Action<boolean> = ({ state }, x) => {
  state.navHovered = x
}

export const setShare: Action<{ key: string; value: any }> = ({ state }, { key, value }) => {
  state.share[key] = value
}
