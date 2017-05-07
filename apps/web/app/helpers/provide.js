import React from 'react'
import { observable } from 'mobx'

const idFn = _ => _

class Cache {
  cache = {}
  revive(module, provides) {
    if (module.hot.data) {
      this.cache[module.id] = this.getCached(module.hot.data, provides)
    }
  }
  restore(instance, provides, module) {
    if (!module || !module.hot) {
      return provides
    }
    const restored = this.previous(instance, module.id)
    return Object.keys(provides).reduce(
      (acc, key) => ({
        ...acc,
        [key]: restored[key] || provides[key],
      }),
      {}
    )
  }
  // private
  getCached({ stores }, current): Object<string, Store> {
    let result = {}
    if (stores) {
      const storeNames = Object.keys(stores)
      for (const key of storeNames) {
        const store = stores[key]
        result[key] = store
      }
    }
    return result
  }
  previous(instance, id) {
    const result = {}
    // restore
    if (this.cache[id]) {
      const cached = this.cache[id]
      if (cached._isKeyed_) {
        Object.assign(result, cached[instance.props.storeKey])
      } else {
        Object.assign(result, cached)
      }
    }
    return result
  }
}

export default function createProvider(options: Object) {
  const { mobx } = options
  const cache = new Cache()

  return function storeProvider(allStores: Object, _module: Object) {
    return function decorator(Klass) {
      // hmr restore
      if (_module) {
        cache.revive(_module, allStores)
      }

      let Stores = allStores

      // call decorators
      if (options.storeDecorator && allStores) {
        for (const key of Object.keys(allStores)) {
          Stores[key] = options.storeDecorator(allStores[key])
        }
      }

      // return HoC
      return class Provider extends React.Component {
        componentWillReceiveProps(nextProps) {
          this._props = nextProps
        }

        componentWillMount() {
          // for reactive props in stores
          if (mobx) {
            mobx.extendShallowObservable(this, { _props: this.props })
          } else {
            this._props = this.props
          }

          const getProps = {
            get: () => this._props,
            set: () => {},
            configurable: true,
          }

          // start stores
          this.stores = Object.keys(Stores).reduce((acc, cur) => {
            const Store = Stores[cur]

            function createStore() {
              Object.defineProperty(Store.prototype, 'props', getProps)
              const store = new Store()
              Object.defineProperty(store, 'props', getProps)
              return store
            }

            return {
              ...acc,
              [cur]: createStore(),
            }
          }, {})

          if (_module && _module.hot) {
            _module.hot.dispose(data => {
              data.stores = this.state.stores
            })
          }

          // optional mount function
          if (options.onStoreMount) {
            for (const name of Object.keys(this.stores)) {
              // fallback to store if nothing returned
              this.stores[name] =
                options.onStoreMount(name, this.stores[name], this.props) ||
                this.stores[name]
            }
          }

          this.state = {
            stores: cache.restore(this, this.stores, _module),
          }
        }

        componentWillUnmount() {
          if (options.onStoreUnmount) {
            for (const name of Object.keys(this.state.stores)) {
              options.onStoreUnmount(name, this.state.stores[name])
            }
          }
        }

        render() {
          return <Klass {...this.props} {...this.state.stores} />
        }
      }
    }
  }
}
