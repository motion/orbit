import { Action } from 'overmind'

export const setNavVisible: Action<boolean> = ({ state }, x) => {
  state.navVisible = x
}
