import { isObject } from 'lodash'
import { Action } from 'overmind'
import { isValidElement } from 'react'

export const setNavVisible: Action<boolean> = ({ state }, x) => {
  state.navVisible = x
}

export const setNavHovered: Action<boolean> = ({ state }, x) => {
  state.navHovered = x
}

export const setShare: Action<{ key: string; value: any }> = ({ state }, { key, value }) => {
  filterReactElementObj(value)
  console.log('setting', value)
  state.share[key] = value
}

const filterReactElementObj = obj => {
  for (const key in obj) {
    if (isValidElement(obj)) {
      obj[key] = null
    }
    if (obj[key] && isObject(obj[key])) {
      filterReactElementObj(obj[key])
    }
  }
}
