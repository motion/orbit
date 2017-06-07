import React from 'react'
import ClassHelpers from './helpers/classHelpers'
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

function viewDecorator(View, options) {
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

function decorateView(View, options) {
  if (IS_PROD) {
    return viewDecorator(View, options)
  } else {
    try {
      return viewDecorator(View, options)
    } catch (e) {
      // add helpful log
      console.error(`Error decorating view ${View.name}`, View)
      throw e
    }
  }
}

//
// @view
//

export default function view(
  viewOrStores: Object | Class | Function,
  options = {}
) {
  // @view({ ...stores }) shorthand
  if (typeof viewOrStores === 'object') {
    const Stores = viewOrStores
    return View => {
      const provider = storeProvider(Stores, options)
      const view = decorateView(View, options)
      return provider(view)
    }
  }

  const View = viewOrStores

  // functional component
  if (!View.prototype.render) {
    return glossy(observer(View))
  }

  // class
  return decorateView(viewOrStores, options)
}

//
// view.* helpers
//

view.plain = View => view(View, { simple: true })

// @view.ui passes themes
view.ui = View => {
  const next = view(View, { simple: true })
  // adds gloss theme context getters
  next.contextTypes = {
    ...next.contextTypes,
    uiTheme: object,
    uiActiveTheme: string,
    ui: object,
  }
  return next
}

// @view.provide passes stores down context until @view.attach grabs them
view.provide = (Stores, options = {}) => PlainView =>
  storeProvider(Stores, { ...options, context: Stores })(
    decorateView(PlainView, options)
  )

// @view.attach grabs stores from @view.provide above
view.attach = storeAttacher
