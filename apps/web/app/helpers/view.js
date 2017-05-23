import React from 'react'
import ClassHelpers from './classHelpers'
import { CompositeDisposable } from 'motion-class-helpers'
import mixin from 'react-mixin'
import autobind from 'autobind-decorator'
import { observer } from 'mobx-react'
import glossy from './styles'
import rxToMobx from './external/rxToMobx'
import { storeProvider, storeAttacher } from './store'
import { string, object } from 'prop-types'
import { pickBy } from 'lodash'

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
    return or.call(this, this.props, this.state, this.context)
  }

  // @view.simple = avoid mobx
  if (options && options.simple) {
    return autobind(glossy(View))
  }

  // order important: autobind, gloss, mobx
  const DecoratedView = autobind(glossy(observer(View)))

  return DecoratedView
}

// @view
export default function view(
  viewOrStores: Object | Class | Function,
  options = {}
) {
  // hacky, until time to rewrite
  if (view.attachNames) {
    options.attach = view.attachNames
    delete view.attachNames
  }

  // @view({ ...stores }) shorthand
  if (typeof viewOrStores === 'object') {
    const Stores = viewOrStores
    return View => {
      const provider = storeProvider(Stores, options)
      const view = decorateView(View, options)
      return storeAttacher(provider(view), options)
    }
  }

  const View = viewOrStores
  let finalView

  // functional component
  if (!View.prototype.render) {
    finalView = glossy(observer(View))
  } else {
    // class
    finalView = decorateView(viewOrStores, options)
  }

  return storeAttacher(finalView, options)
}

view.plain = View => view(View, { simple: true })

// @view.ui passes themes
view.ui = View => {
  const next = view(View, { simple: true })
  // adds gloss theme context getters
  next.contextTypes = {
    uiTheme: object,
    uiActiveTheme: string,
  }
  return next
}

// @view.provide passes stores down context until @view.attach grabs them
view.provide = (Stores, options = {}) => PlainView =>
  storeProvider(Stores, { ...options, context: Stores })(
    decorateView(PlainView, options)
  )

// @view.attach grabs stores from @view.provide above
view.attach = (...names) => {
  view.attachNames = names
  return view
}
