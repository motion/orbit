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
import createView from 'motion-view'
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

// @view
export default function view(View) {
  // shorthand for providing stores to view
  if (typeof View === 'object') {
    return view.provide(View)
  }

  // extend React.Component
  Object.setPrototypeOf(View.prototype, React.Component.prototype)

  // add Helpers
  mixin(View.prototype, Helpers)
  mixin(View.prototype, ViewHelpers)

  // preact-like render
  const or = View.prototype.render
  View.prototype.render = function() {
    if (IS_PROD) {
      return or.call(this, this.props, this.state, this.context)
    } else {
      try {
        return or.call(this, this.props, this.state, this.context)
      } catch (e) {
        console.error(e)
        return null
      }
    }
  }

  // order important: autobind, gloss, mobx
  return autobind(glossy(observer(View)))
}

const StoreHelpers = {
  start() {
    this.subscriptions = new CompositeDisposable()
  },
  stop() {
    this.subscriptions.dispose()
  },
}

const provide = createView({
  mobx,
  storeDecorator(Store) {
    mixin(Store.prototype, Helpers)
    mixin(Store.prototype, StoreHelpers)
    return Store
  },
  onStoreMount(name, store, props) {
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
      } else if (typeof val !== 'function' && !isObservable(val)) {
        extendShallowObservable(store, { [methodName]: val })
      }
    }

    store.start(props)

    // smart watch
    const { watch } = store.constructor
    console.log('watch is', watch)
    if (watch && Array.isArray(watch)) {
      for (const key of watch) {
        store.watch(store[key].bind(store))
      }
    }

    return store
  },
  onStoreUnmount(name, store) {
    store.stop()
  },
})

// @view.provide({})
// or @view({})
view.provide = (...args) => View => provide(...args)(view(View))

// @view.watch
view.watch = (parent, property, { initializer, ...desc }) => {
  return {
    ...desc,
    initializer: function() {
      parent.constructor.watch = parent.constructor.watch || []
      parent.constructor.watch.push(property)
      return initializer.call(this)
    },
  }
}
