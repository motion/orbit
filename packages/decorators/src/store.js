import mixin from 'react-mixin'
import autobind from 'autobind-decorator'
import classHelpers from './classHelpers'

// @store
export function store(Store) {
  mixin(Store.prototype, classHelpers)
  return autobind(Store)
}
