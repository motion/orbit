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
import mobx, { isObservable, extendShallowObservable } from 'mobx'
import { observer } from 'mobx-react'
import createProvider from './provide'
import glossy from './styles'
import { IS_PROD } from '~/constants'

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
  mobx,
  storeDecorator(Store) {
    mixin(Store.prototype, Helpers)
    return Store
  },
  onStoreMount(name, store, props) {
    store.subscriptions = new CompositeDisposable()

    // automagic observables
    for (const methodName of Object.keys(store)) {
      if (methodName === 'observe') {
        continue
      }

      const val = store[methodName]

      // auto-get observable for @query
      if (val && val.$isQuery) {
        Object.defineProperty(store, methodName, {
          get: () => val.current,
        })
        // dispose on unmount
        store.subscriptions.add(val)
      } else if (typeof val !== 'function' && !isObservable(val)) {
        // auto observable
        extendShallowObservable(store, { [methodName]: val })
      }
    }

    if (store.start) {
      store.start(props)
    }

    // smart watch
    const { watch } = store.constructor
    if (watch && typeof watch === 'object') {
      for (const key of Object.keys(watch)) {
        store.watch(store[key].bind(store))
      }
    }

    return store
  },
  onStoreUnmount(name, store) {
    if (store.stop) {
      store.stop()
    }
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

// @view.watch
// hack
view.watch = (parent, property, { initializer, ...desc }) => {
  return {
    ...desc,
    initializer: function() {
      parent.constructor.watch = parent.constructor.watch || {}
      parent.constructor.watch[property] = true
      return initializer.call(this)
    },
  }
}
