import mixin from 'react-mixin'
import autobind from 'autobind-decorator'
import * as ClassHelpers from './classHelpers'
import { view } from './view'

// @store
export function store(Store) {
  mixin(Store.prototype, ClassHelpers)
  return view.injectDecorator(autobind(Store))
}
