import React from 'react'
import ClassHelpers from './classHelpers'
import { CompositeDisposable } from 'motion-class-helpers'
import mixin from 'react-mixin'
import autobind from 'autobind-decorator'
import { observer } from 'mobx-react'
import glossy from './styles'
import rxToMobx from './external/rxToMobx'
import { storeProvider } from './store'
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

  if (options && options.attach) {
    return class ContextAttacher extends React.Component {
      static contextTypes = {
        stores: object,
      }

      render() {
        return (
          <DecoratedView
            {...this.props}
            {...pickBy(stores, key => key.indexOf(options.attach) !== -1)}
          />
        )
      }
    }
  }

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
    return View => storeProvider(Stores, options)(decorateView(View, options))
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
view.provide = (Stores, options) => PlainView => {
  const provider = storeProvider(Stores, options)
  const View = decorateView(PlainView, options)

  return provider(
    class ContextProvider extends React.Component {
      static contextTypes = {
        stores: object,
      }

      static childContextTypes = {
        stores: object,
      }

      getChildContext() {
        if (this.context.stores) {
          Object.keys(Stores).forEach(name => {
            if (this.context.stores[name]) {
              throw new Error(
                `Attempting to provide a store as a name already provided: ${name} from ${View.name}`
              )
            }
          })
        }

        return {
          stores: {
            ...this.context.stores,
            ...Stores,
          },
        }
      }

      render() {
        return <View {...this.props} />
      }
    }
  )
}

// @view.attach grabs stores from @view.provide above
view.attach = (...names) => {
  view.attachNames = names
  return view
}
