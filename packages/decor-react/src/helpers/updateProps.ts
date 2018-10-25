import { difference } from 'lodash'
import isEqualReact from 'react-fast-compare'
import * as Mobx from 'mobx'
import { getNonReactElementProps } from './getNonReactElementProps'
import { isValidElement } from 'react'

const granluarUpdate = (props, nextProps) => {
  const nextPropsFinal = getNonReactElementProps(nextProps)
  const curPropKeys = Object.keys(props)
  const nextPropsKeys = Object.keys(nextPropsFinal)
  // change granular so reactions are granular
  for (const prop of nextPropsKeys) {
    // 🏎 lets warn on slow updates just to be sure...
    let now
    if (process.env.NODE_ENV === 'development') {
      now = Date.now()
    }
    // this is the actual comparison
    const a = props[prop]
    const b = nextPropsFinal[prop]
    const isSame = a === b
    const isSameReact = isValidElement(a) && isEqualReact(a, b)
    const hasChanged = !(isSame || isSameReact)
    if (hasChanged) {
      props[prop] = nextPropsFinal[prop]
    }
    // 🏎 ...log the warning here
    if (process.env.NODE_ENV === 'development') {
      if (Date.now() - now > 4) {
        console.warn('slow ass compare!', Date.now() - now, prop, props[prop], nextPropsFinal[prop])
      }
    }
  }
  // remove
  for (const extraProp of difference(curPropKeys, nextPropsKeys)) {
    props[extraProp] = undefined
  }
}

// keep action out of class directly because of hmr bug
export const updateProps = Mobx.action('updateProps', granluarUpdate)
