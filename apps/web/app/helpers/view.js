import {
  addEvent,
  setTimeout,
  setInterval,
  ref,
  CompositeDisposable,
} from 'motion-class-helpers'
import { watch, react } from 'motion-mobx-helpers'
import mixin from 'react-mixin'
import autobind from 'autobind-decorator'
import React from 'react'
import { action, isObservable, extendShallowObservable } from 'mobx'
import { observer } from 'mobx-react'
import createProvider from './provide'
import glossy from './styles'
import { IS_PROD } from '~/constants'
import App from 'models'

const ViewHelpers = {
  componentWillMount() {
    this.subscriptions = new CompositeDisposable()
  },
  componentWillUnmount() {
    this.subscriptions.dispose()
  },
}

const Helpers = {
  addEvent,
  setInterval,
  setTimeout,
  ref,
  watch,
  react,
}

const storeProvider = createProvider({
  storeDecorator(Store) {
    mixin(Store.prototype, Helpers)
    return autobind(Store)
  },
  onStoreMount(name, store, props) {
    store.subscriptions = new CompositeDisposable()

    // automagic observables

    const methods = Object.getOwnPropertyNames(store).filter(
      x => !/subscriptions|props/.test(x)
    )

    for (const method of methods) {
      const val = store[method]
      // automatic stuff on stores
      if (val && val.$isQuery) {
        // auto @query
        Object.defineProperty(store, method, {
          get: () => val.current,
        })
        store.subscriptions.add(val)
      } else if (typeof val !== 'function' && !isObservable(val)) {
        // auto observables
        extendShallowObservable(store, { [method]: val })
      } else if (typeof val === 'function') {
        // auto action functions
        store[method] = action(
          `${store.constructor.name}.${method}`,
          store[method]
        )
      }
    }

    if (store.start) {
      store.start(props)
    }

    // add to app
    App.stores[store.constructor.name] = store

    return store
  },
  onStoreUnmount(name, store) {
    if (store.stop) {
      store.stop()
    }
    // remove from app
    delete App.stores[store.constructor.name]
    store.subscriptions.dispose()
  },
})

function decorateView(View) {
  // extend React.Component
  Object.setPrototypeOf(View.prototype, React.Component.prototype)
  // add Helpers
  mixin(View.prototype, Helpers)
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
export default function view(viewOrOpts, _module) {
  let View = viewOrOpts

  // @view({ ...stores }) shorthand
  if (typeof viewOrOpts === 'object') {
    return View => storeProvider(viewOrOpts, _module)(decorateView(View))
  }

  return decorateView(viewOrOpts)
}
