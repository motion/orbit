import React from 'react'
import * as Mobx from 'mobx'
import { view } from '@mcro/black'
import { object } from 'prop-types'
import { pickBy } from 'lodash'
import hoistStatics from 'hoist-non-react-statics'
import Redbox from 'redbox-react'

export default function storeProvidable(options, emitter) {
  return {
    name: 'store-providable',
    decorator: (Klass, opts = {}) => {
      const allStores = opts.stores || options.stores
      const context = opts.context || options.context
      const storeDecorator = opts.storeDecorator || options.storeDecorator

      if (!allStores) {
        return Klass
      }

      // see setupStores()
      let Stores

      function decorateStores() {
        Stores = allStores
        if (storeDecorator && allStores) {
          for (const key of Object.keys(allStores)) {
            Stores[key] = storeDecorator(allStores[key])
          }
        }
      }

      decorateStores()

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
          this.setupStores()
          this.unmounted = false
        }

        componentDidMount() {
          if (this.state.stores === null) {
            return
          }
          this.mountStores()
          view.on('hmr', this.clearError)
        }

        clearError = () => {
          this.setState({ error: null })
        }

        componentWillUnmount() {
          // if you remove @view({ store: ... }) it tries to remove it here but its gone
          if (this.disposeStores) {
            this.disposeStores()
            view.off('hmr', this.clearError)
            this.unmounted = true
          }
        }

        unstable_handleError(error) {
          this.setState({ error })
          console.error(error)
        }

        setupStores() {
          const getProps = {
            get: () => this._props,
            configurable: true,
          }

          // start stores
          const stores = Object.keys(Stores).reduce((acc, cur) => {
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

          // optional mount function
          if (options.onStoreMount) {
            for (const name of Object.keys(stores)) {
              // fallback to store if nothing returned
              stores[name] =
                options.onStoreMount(stores[name], this.props) || stores[name]
            }
          }

          this.setState({ stores })
        }

        mountStores() {
          for (const name of Object.keys(this.state.stores)) {
            const store = this.state.stores[name]
            emitter.emit('store.mount', store)
            if (options.onStoreDidMount) {
              options.onStoreDidMount(store, this.props)
            }
          }
        }

        disposeStores = () => {
          if (!this.state.stores) {
            log('no stores to dispose')
            return
          }
          for (const name of Object.keys(this.state.stores)) {
            const store = this.state.stores[name]
            emitter.emit('store.unmount', store)
            if (options.onStoreUnmount) {
              options.onStoreUnmount(store)
            }
          }
        }

        hotReload = () => {
          if (this.unmounted) {
            // waiting to see if this is why unmountCOmponent errs happen
            debugger
          }
          this.disposeStores()
          this.setupStores()
          this.mountStores()
        }

        render() {
          if (this.state.error) {
            return <Redbox $$draggable error={this.state.error} />
          }
          if (this.failed || !this.state) {
            console.log('failed view', this)
            return null
          }

          return (
            <Klass
              {...this.props}
              {...this.state.stores}
              disposeStores={this.disposeStores}
            />
          )
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
