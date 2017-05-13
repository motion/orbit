import ClassHelpers from './classHelpers'
import { CompositeDisposable } from 'motion-class-helpers'
import mixin from 'react-mixin'
import autobind from 'autobind-decorator'
import React from 'react'
import { observer } from 'mobx-react'
import glossy from './styles'
import rxToMobx from './external/rxToMobx'
import { storeProvider } from './store'

const ViewHelpers = {
  componentWillMount() {
    this.subscriptions = new CompositeDisposable()
    rxToMobx(this)
  },
  componentWillUnmount() {
    this.subscriptions.dispose()
  },
}

function decorateView(View) {
  // extend React.Component
  Object.setPrototypeOf(View.prototype, React.Component.prototype)
  // add Helpers
  mixin(View.prototype, ClassHelpers)
  mixin(View.prototype, ViewHelpers)
  // preact-like render
  const or = View.prototype.render
  View.prototype.render = function() {
    return or.call(this, this.props, this.state, this.context)
  }
  // order important: autobind, gloss, mobx
  return autobind(glossy(observer(View)))
}

// @view
export default function view(
  viewOrStores: Object | Class | Function,
  _module,
  debug
) {
  // @view({ ...stores }) shorthand
  if (typeof viewOrStores === 'object') {
    const Stores = viewOrStores
    return View => storeProvider(Stores, _module)(decorateView(View))
  }

  const View = viewOrStores

  // functional component
  if (!View.prototype.render) {
    return glossy(observer(View))
  }

  // class
  return decorateView(viewOrStores)
}
