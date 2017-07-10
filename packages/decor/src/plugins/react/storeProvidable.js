import React from 'react'
import * as Mobx from 'mobx'
import { object } from 'prop-types'
import { pickBy } from 'lodash'
import hoistStatics from 'hoist-non-react-statics'
import Redbox from 'redbox-react'

export default function storeProvidable(options, emitter) {
  const hmrd = {}

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

      // see setupStores()
      let Stores

      function initStores() {
        Stores = allStores

        // call decorators
        if (storeDecorator && allStores) {
          for (const key of Object.keys(allStores)) {
            Stores[key] = storeDecorator(allStores[key])
          }
        }
      }

      initStores()

      // return HoC
      class StoreProvider {
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
        }

        componentDidMount() {
          if (this.state.stores === null) {
            console.log('temp fix stores debug')
            return
          }
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
          this.disposeStores()
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

          // line below used to be (hmr state preserve):
          // stores: cache.restore(
          //   this,
          //   stores,
          //   instanceOpts && instanceOpts.module
          // )
          this.setState({ stores })
        }

        unstable_handleError(error) {
          console.error('ERR', error)
          this.setState({ error })
          throw error
        }

        clearErrors() {
          this.setState({ error: null })
        }

        handleHotReload = module => {
          // console.log(module, Stores, this.state.stores)

          // debounce
          if (hmrd[module.id]) {
            clearTimeout(hmrd[module.id])
          }
          hmrd[module.id] = setTimeout(() => {
            console.log(`[HMR] file: ${module.id}`)
            window.App && window.App.clearErrors && window.App.clearErrors()
            this.clearErrors()
            // initStores()
            this.module = module
            this.disposeStores()
            this.setupStores()
          }, 150)
        }

        disposeStores() {
          if (!this.state.stores) {
            log('bad dismount, this is an old store')
            return
          }
          emitter.emit('view.unmount', this)
          for (const name of Object.keys(this.state.stores)) {
            const store = this.state.stores[name]
            emitter.emit('store.unmount', store)
            if (options.onStoreUnmount) {
              options.onStoreUnmount(store)
            }
          }
        }

        render() {
          if (this.failed || !this.state) {
            console.log('failed view', this)
            return null
          }

          if (this.state.error) {
            return <Redbox $$draggable error={this.state.error} />
          }

          return <Klass {...this.props} {...this.state.stores} />
        }
      }

      // copy statics
      hoistStatics(StoreProvider, Klass)

      // copy non-statics
      Object.setPrototypeOf(Klass.prototype, React.Component.prototype)
      Object.setPrototypeOf(StoreProvider.prototype, Klass.prototype)

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
