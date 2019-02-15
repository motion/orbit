import isEqualReact from '@mcro/fast-compare'
import { difference } from 'lodash'
import { isValidElement } from 'react'
import { getNonReactElementProps } from './getNonReactElementProps'

export const updateProps = (props, nextProps) => {
  const nextPropsFinal = getNonReactElementProps(nextProps)
  const curPropKeys = Object.keys(props)
  const nextPropsKeys = Object.keys(nextPropsFinal)
  // change granular so reactions are granular
  for (const prop of nextPropsKeys) {
    // this is the actual comparison
    const a = props[prop]
    const b = nextPropsFinal[prop]
    const isSame = a === b
    const isSameReact = isValidElement(a) && isEqualReact(a, b)
    const hasChanged = !(isSame || isSameReact)
    if (hasChanged) {
      props[prop] = nextPropsFinal[prop]
    }
  }
  // remove
  for (const extraProp of difference(curPropKeys, nextPropsKeys)) {
    props[extraProp] = undefined
  }
}
