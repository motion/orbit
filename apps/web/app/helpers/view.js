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
import {
  action,
  isObservable,
  extendShallowObservable,
  extendObservable,
} from 'mobx'
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
    const descriptors = Object.getOwnPropertyDescriptors(store)

    for (const method of Object.keys(descriptors)) {
      if (/^(\$mobx|subscriptions|props|\_.*)$/.test(method)) {
        continue
      }

      const val = store[method]

      const isFunction = typeof val === 'function'
      const isQuery = val && val.$isQuery

      // auto @query => observable
      if (isQuery) {
        Object.defineProperty(store, method, {
          get() {
            return val.current
          },
        })
        store.subscriptions.add(val)
        continue
      }

      if (isObservable(val)) {
        continue
      }

      // auto
      if (isFunction) {
        // @action functions
        store[method] = action(
          `${store.constructor.name}.${method}`,
          store[method]
        )
      } else {
        const descriptor = descriptors[method]
        if (descriptor.get) {
          // @computed getters
          const getter = {
            [method]: descriptor.get(),
          }
          Object.defineProperty(getter, method, descriptor)
          extendObservable(store, getter)
        } else {
          // @observable values
          extendShallowObservable(store, { [method]: val })
        }
      }
    }

    if (store.start) {
      store.start(props)
    }

    // TODO put this in didMount not willMount & remove timeout
    setTimeout(() => {
      App.setStore(store.constructor.name, store)
    })

    return store
  },
  onStoreUnmount(name, store) {
    if (store.stop) {
      store.stop()
    }
    App.removeStore(store.constructor.name)
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
