import ClassHelpers from './classHelpers'
import { CompositeDisposable } from 'motion-class-helpers'
import mixin from 'react-mixin'
import autobind from 'autobind-decorator'
import React from 'react'
import { observer } from 'mobx-react'
import glossy from './styles'
import rxToMobx from './external/rxToMobx'
import { storeProvider } from './store'
import { string, object } from 'prop-types'

const ViewHelpers = {
  componentWillMount() {
    this.subscriptions = new CompositeDisposable()
    rxToMobx(this)
  },
  componentWillUnmount() {
    this.subscriptions.dispose()
  },
}

function decorateView(View, options) {
  // extend React.Component
  Object.setPrototypeOf(View.prototype, React.Component.prototype)
  // add Helpers
  mixin(View.prototype, ClassHelpers)
  mixin(View.prototype, ViewHelpers)
  // preact-like render
  const or = View.prototype.render
  View.prototype.render = function() {
    if (this.props.store && this.props.store._id)
      console.log('GOT EM', this.props.store && this.props.store._id)

    return or.call(this, this.props, this.state, this.context)
  }

  // just avoid mobx
  if (options && options.simple) {
    return autobind(glossy(View))
  }

  // order important: autobind, gloss, mobx
  return autobind(glossy(observer(View)))
}

// @view
export default function view(viewOrStores: Object | Class | Function, options) {
  // @view({ ...stores }) shorthand
  if (typeof viewOrStores === 'object') {
    const Stores = viewOrStores
    return View => storeProvider(Stores)(decorateView(View, options))
  }

  const View = viewOrStores

  // functional component
  if (!View.prototype.render) {
    return glossy(observer(View))
  }

  // class
  return decorateView(viewOrStores, options)
}

view.plain = View => view(View, { simple: true })

view.ui = View => {
  const next = view(View, { simple: true })
  // adds gloss theme context getters
  next.contextTypes = {
    uiTheme: object,
    uiActiveTheme: string,
  }
  return next
}
