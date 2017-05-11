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
import { fromStream } from 'mobx-utils'
import Rx from 'rxjs'

const ViewHelpers = {
  componentWillMount() {
    this.subscriptions = new CompositeDisposable()

    // auto rx => mobx
    Object.keys(this).forEach(key => {
      if (this[key] instanceof Rx.Observable) {
        const stream = this[key]
        this[`${key}__stream`] = stream
        const observable = fromStream(stream)
        this.subscriptions.add(() => {
          stream.unsubscribe()
          delete this[`${key}__stream`]
        })
        Object.defineProperty(this, key, {
          get() {
            return observable.current
          },
        })
      }
    })
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

function storeDecorators(obj) {
  // automagic observables
  const descriptors = Object.getOwnPropertyDescriptors(obj)

  for (const method of Object.keys(descriptors)) {
    if (/^(\$mobx|subscriptions|props|\_.*)$/.test(method)) {
      continue
    }

    const val = obj[method]

    const isFunction = typeof val === 'function'
    const isQuery = val && val.$isQuery

    // auto @query => observable
    if (isQuery) {
      Object.defineProperty(obj, method, {
        get() {
          return val.current
        },
      })
      obj.subscriptions.add(val)
      continue
    }

    if (isObservable(val)) {
      continue
    }

    // auto Rx => mobx
    if (val instanceof Rx.Observable) {
      observableRxToObservableMobx(obj, method)
      continue
    }

    // auto function actions
    if (isFunction) {
      // @action functions
      obj[method] = action(`${obj.constructor.name}.${method}`, obj[method])
    } else {
      // auto @computed get
      const descriptor = descriptors[method]
      if (descriptor.get) {
        const getter = {
          [method]: descriptor.get(),
        }
        Object.defineProperty(getter, method, descriptor)
        extendObservable(obj, getter)
      } else {
        // auto everything is an @observable.ref
        extendShallowObservable(obj, { [method]: val })
      }
    }
  }
}

function autoObserveObservables(obj) {
  for (const method of Object.keys(obj)) {
    console.log('is', method, obj[method])
    if (obj[method] instanceof Rx.Observable) {
      observableRxToObservableMobx(obj, method)
    }
  }
}

function observableRxToObservableMobx(obj, method) {
  extendShallowObservable(obj, { [method]: fromStream(obj[method]) })
}

const storeProvider = createProvider({
  storeDecorator(Store) {
    mixin(Store.prototype, Helpers)
    return autobind(Store)
  },
  onStoreMount(name, store, props) {
    store.subscriptions = new CompositeDisposable()
    storeDecorators(store)
    if (store.start) {
      store.start(props)
    }
    return store
  },
  onStoreDidMount(name, store) {
    App.setStore(store.constructor.name, store)
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
export default function view(viewOrOpts, _module, debug) {
  let View = viewOrOpts

  // @view({ ...stores }) shorthand
  if (typeof viewOrOpts === 'object') {
    return View => storeProvider(viewOrOpts, _module)(decorateView(View))
  }

  // functional component
  if (!View.prototype.render) {
    return glossy(observer(View))
  }

  return decorateView(viewOrOpts)
}
