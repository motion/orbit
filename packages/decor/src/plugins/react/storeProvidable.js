import React from 'react'
import * as Mobx from 'mobx'
import Cache from './cache'
import { object } from 'prop-types'
import { pickBy } from 'lodash'
import hoistStatics from 'hoist-non-react-statics'
import Redbox from 'redbox-react'

export default function storeProvidable(options, emitter) {
  const cache = new Cache()
  const { instanceOpts } = options

  return {
    name: 'store-providable',
    decorator: (Klass, opts = {}) => {
      const allStores = opts.stores || options.stores
      const context = opts.context || options.context
      const storeDecorator = opts.storeDecorator || options.storeDecorator

      if (!allStores) {
        return Klass
      }

      // hmr restore
      // if (instanceOpts && instanceOpts.module) {
      //   cache.revive(instanceOpts.module, allStores)
      // }

      let Stores = allStores

      // call decorators
      if (storeDecorator && allStores) {
        for (const key of Object.keys(allStores)) {
          Stores[key] = storeDecorator(allStores[key])
        }
      }

      // return HoC
      class StoreProvider extends React.Component {
        static get name() {
          return Klass.name
        }

        state = {
          error: null,
          stores: null,
        }

        getChildContext() {
          if (context && Stores) {
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
          // 🐛 if you define this as normal observable on class
          //    it will break with never before seen mobx bug on next line
          Mobx.extendShallowObservable(this, { _props: null })
          this._props = { ...this.props }

          const getProps = {
            get: () => this._props,
            configurable: true,
          }

          // start stores
          const finalStores = Object.keys(Stores).reduce((acc, cur) => {
            const Store = Stores[cur]

            const createStore = () => {
              Object.defineProperty(Store.prototype, 'props', getProps)
              const store = new Store()
              delete Store.prototype.props // safety, remove hack
              // then define directly
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
                options.onStoreMount(finalStores[name], this.props) ||
                finalStores[name]
            }
          }

          // line below used to be (hmr state preserve):
          // stores: cache.restore(
          //   this,
          //   finalStores,
          //   instanceOpts && instanceOpts.module
          // )
          this.setState({
            stores: finalStores,
          })
        }

        componentDidMount() {
          emitter.emit('view.mount', this)
          for (const name of Object.keys(this.state.stores)) {
            const store = this.state.stores[name]
            emitter.emit('store.mount', store)
            if (options.onStoreDidMount) {
              options.onStoreDidMount(store, this.props)
            }
          }
        }

        componentWillUnmount() {
          emitter.emit('view.unmount', this)
          for (const name of Object.keys(this.state.stores)) {
            const store = this.state.stores[name]
            emitter.emit('store.unmount', store)
            if (options.onStoreUnmount) {
              options.onStoreUnmount(store)
            }
          }
        }

        unstable_handleError(error) {
          console.error('ERR', error)
          this.setState({ error })
          throw error
        }

        clearErrors() {
          this.setState({ error: null })
        }

        render() {
          if (this.state.error) {
            return <Redbox error={this.state.error} />
          }

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
