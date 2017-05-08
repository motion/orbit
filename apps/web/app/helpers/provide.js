import React from 'react'
import { observable } from 'mobx'
import Cache from './cache'

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
