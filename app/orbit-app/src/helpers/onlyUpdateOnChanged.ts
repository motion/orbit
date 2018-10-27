import { RECENT_HMR } from '../constants'
import isEqual from 'react-fast-compare'

export function onlyUpdateOnChanged(nextProps, _nextState) {
  return !isEqual(this.props.children, nextProps.children) || RECENT_HMR()
}
