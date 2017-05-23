import React from 'react'
import { observable } from 'mobx'
import Cache from './cache'

type InstanceOptions = {
  module: Object,
  attach: Array<string>,
}

export default function createStoreProvider(options: Object) {
  const cache = new Cache()

  return function storeProvider(
    allStores: Object,
    instanceOpts: InstanceOptions
  ) {
    return function decorator(Klass) {
      // hmr restore
      if (instanceOpts && instanceOpts.module) {
        cache.revive(instanceOpts.module, allStores)
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
        @observable _props = {}

        componentWillReceiveProps(nextProps) {
          this._props = nextProps
        }

        componentWillMount() {
          // for reactive props in stores
          this._props = { ...this.props }

          const getProps = {
            get: () => this._props,
            set: () => {},
            configurable: true,
          }

          // start stores
          const finalStores = Object.keys(Stores).reduce((acc, cur) => {
            const Store = Stores[cur]

            const createStore = () => {
              Object.defineProperty(Store.prototype, 'props', getProps)
              const store = new Store(this._props)
              delete Store.prototype.props // safety, remove hack
              Object.defineProperty(store, 'props', getProps)
              return store
            }

            return {
              ...acc,
              [cur]: createStore(),
            }
          }, {})

          if (instanceOpts && instanceOpts.module && instanceOpts.module.hot) {
            instanceOpts.module.hot.dispose(data => {
              data.stores = this.state.stores
            })
          }

          // optional mount function
          if (options.onStoreMount) {
            for (const name of Object.keys(finalStores)) {
              // fallback to store if nothing returned
              finalStores[name] =
                options.onStoreMount(name, finalStores[name], this.props) ||
                finalStores[name]
            }
          }

          this.setState({
            stores: cache.restore(
              this,
              finalStores,
              instanceOpts && instanceOpts.module
            ),
          })
        }

        componentDidMount() {
          if (options.onStoreDidMount) {
            for (const name of Object.keys(this.state.stores)) {
              options.onStoreDidMount(name, this.state.stores[name], this.props)
            }
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
