import mixin from 'react-mixin'
import autobind from 'autobind-decorator'
import * as ClassHelpers from './classHelpers'

// @store
export function store(Store) {
  mixin(Store.prototype, ClassHelpers)
  return autobind(Store)
}
