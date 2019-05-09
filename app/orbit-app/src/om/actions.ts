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
  state.share[key] = filterReactElementObj(value)
}

const filterReactElementObj = obj => {
  let res = {}
  for (const key in obj) {
    if (isValidElement(obj)) {
      continue
    }
    if (obj[key] && isObject(obj[key])) {
      res[key] = filterReactElementObj(obj[key])
    } else {
      res[key] = obj[key]
    }
  }
  return res
}
