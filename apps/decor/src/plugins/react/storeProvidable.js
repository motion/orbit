import React from 'react'
import { observable } from 'mobx'
import Cache from './cache'
import { object } from 'prop-types'
import { pickBy } from 'lodash'
import hoistStatics from 'hoist-non-react-statics'

type InstanceOptions = {
  module: Object,
  attach: Array<string>,
}

export default function storeProvidable(options) {
  const cache = new Cache()
  const { stores: allStores, instanceOpts, storeDecorator, context } = options

  return {
    decorator: Klass => {
      // hmr restore
      if (instanceOpts && instanceOpts.module) {
        cache.revive(instanceOpts.module, allStores)
      }

      let Stores = allStores

      // call decorators
      if (storeDecorator && allStores) {
        for (const key of Object.keys(allStores)) {
          console.log('decos')
          Stores[key] = storeDecorator(allStores[key])
        }
      }

      // return HoC
      class StoreProvider extends React.Component {
        @observable _props = {}

        getChildContext() {
          const Stores = context
          if (Stores) {
            if (options.warnOnOverwriteStore && this.context.stores) {
              Object.keys(Stores).forEach(name => {
                if (this.context.stores[name]) {
                  console.log(
                    `Notice! You are overwriting an existing store in provide. This may be intentional: ${name} from ${Klass.name}`
                  )
                }
              })
            }

            const names = Object.keys(Stores)
            const stores = {
              ...this.context.stores,
              ...pickBy(
                this.state.stores,
                (value, key) => names.indexOf(key) >= 0
              ),
            }

            return { stores }
          }
        }

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

      // copy statics
      hoistStatics(StoreProvider, Klass)

      // add stores to context
      if (context) {
        StoreProvider.contextTypes = {
          stores: object,
        }
        StoreProvider.childContextTypes = {
          stores: object,
        }
      }

      return StoreProvider
    },
  }
}
