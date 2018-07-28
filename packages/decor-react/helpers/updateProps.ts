import { difference } from 'lodash'
import isEqual from 'react-fast-compare'
import * as Mobx from 'mobx'
import { getNonReactElementProps } from './getNonReactElementProps'

// keep action out of class directly because of hmr bug
export const updateProps = Mobx.action('updateProps', (props, nextProps) => {
  const nextPropsFinal = getNonReactElementProps(nextProps)
  const curPropKeys = Object.keys(props)
  const nextPropsKeys = Object.keys(nextPropsFinal)
  // change granular so reactions are granular
  for (const prop of nextPropsKeys) {
    if (!isEqual(props[prop], nextPropsFinal[prop])) {
      props[prop] = nextPropsFinal[prop]
    }
  }
  // remove
  for (const extraProp of difference(curPropKeys, nextPropsKeys)) {
    props[extraProp] = undefined
  }
})
