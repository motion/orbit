import { RECENT_HMR } from '../constants'
import isEqual from 'react-fast-compare'

export function onlyUpdateOnChanged(nextProps, _nextState, nextContext) {
  return (
    !isEqual(this.props.children, nextProps.children) ||
    !isEqual(this.context, nextContext) ||
    RECENT_HMR()
  )
}
