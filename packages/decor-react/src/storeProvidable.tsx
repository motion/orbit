import * as React from 'react'
import * as Mobx from 'mobx'
import root from 'global'
import { StoreContext } from './contexts'
import { Disposable } from 'event-kit'
import { updateProps } from './helpers/updateProps'
import { getNonReactElementProps } from './helpers/getNonReactElementProps'
import { StoreHMR } from '@mcro/store-hmr'

root.loadedStores = new Set()
const storeHMRCache = root.storeHMRCache || {}
root.storeHMRCache = storeHMRCache

const DEFAULT_OPTIONS = {
  onStoreUnmount: () => {},
  onStoreWillMount: () => {},
  onStoreDidMount: () => {},
}

export function storeProvidable(userOptions, Helpers) {
  const options = {
    ...DEFAULT_OPTIONS,
    ...userOptions,
  }

  return {
    name: 'store-providable',
    once: true,
    decorator: (Klass, opts: any = {}) => {
      const allStores = opts.stores || options.stores

      if (!allStores) {
        return Klass
      }

      if (typeof allStores !== 'object') {
        throw new Error('Bad store provide, should be object')
      }

      const context = opts.context || options.context
      const storeDecorator = opts.storeDecorator || options.storeDecorator
      let Stores

      if (storeDecorator && allStores) {
        Stores = {}
        for (const key in allStores) {
          Stores[key] = storeDecorator(allStores[key])
        }
      }

      const unmountStore = (name, store) => {
        options.onStoreUnmount(store)
        Helpers.emit('store.unmount', { name, thing: store })
      }

      const mountStore = (name, store, props) => {
        options.onStoreMount(store, props)
        Helpers.emit('store.mount', { name, thing: store })
      }

      Klass.__hmrId = 0

      // return HoC
      // dont use class properties on this, react-hot-loader seems to pick it up even if cold()

      class StoreProvider extends React.PureComponent {
        props: any | { __contextualStores?: Object }
        _props: any
        stores: any
        willReloadListener: Disposable
        clearUnusedStores = null

        get name() {
          return Klass.name
        }

        constructor(a, b) {
          super(a, b)
          this.setupProps()
          this.setupStores()
        }

        // PureComponent means this is only called when props are not shallow equal
        componentDidUpdate() {
          updateProps(this._props, this.props)
        }

        componentDidMount() {
          root.loadedStores.add(this)
          this.didMountStores()
          this.willReloadListener = Helpers.on('will-hmr', () => {
            this.onWillReloadStores()
          })
        }

        componentWillUnmount() {
          if (this.willReloadListener) {
            this.willReloadListener.dispose()
          }
          root.loadedStores.delete(this)
          // if you remove @view.attach({ store: ... }) it tries to remove it here but its gone
          if (this.disposeStores) {
            this.disposeStores()
          }
        }

        // for reactive props in stores
        // 🐛 must run this before this.setupStore()
        setupProps() {
          if (this._props) {
            return
          }
          const properties = { _props: getNonReactElementProps(this.props) }
          // shallow
          Mobx.extendObservable(this, properties, null, { deep: false })
        }

        setupStores() {
          if (this.stores) return
          this.stores = {}
          // hmr stuff
          const { __hmrPath } = this.props
          const cachedStores = storeHMRCache[__hmrPath]
          const getProps = {
            configurable: true,
            get: () => this._props,
            set() {
              /* ignore */
            },
          }
          for (const name in Stores) {
            const Store = Stores[name]
            Object.defineProperty(Store.prototype, 'props', getProps)
            const nextStore = new Store()
            Object.defineProperty(nextStore, 'props', getProps)

            // hmr hot reload stores, has to be after intantiating to get the real source
            if (process.env.NODE_ENV === 'development') {
              if (cachedStores && cachedStores[name]) {
                // matching source, hot reload
                if (
                  nextStore.constructor.toString() === cachedStores[name].constructor.toString()
                ) {
                  // we have a hydratable store, hot swap it in!
                  this.stores[name] = cachedStores[name]
                  cachedStores[name].__wasHotReloaded = true
                  // be sure to clean up the temporary unused comparison store
                  unmountStore(name, nextStore)
                } else {
                  cachedStores[name].__wasHotReloaded = false
                  Klass.__hmrId = Math.random()
                  // 🐛 we force a key update in the line above so it will re-render and check for unused
                  this.clearUnusedStores = setTimeout(() => {
                    unmountStore(name, cachedStores[name])
                  }, 200)
                }
              }
            }

            // we didn't hydrate it from hmr, set it up normally
            if (!this.stores[name]) {
              this.stores[name] = nextStore
              mountStore(name, nextStore, this.props)
            }
          }
        }

        didMountStores() {
          for (const name in this.stores) {
            options.onStoreDidMount(this.stores[name], this.props)
          }
        }

        disposeStores() {
          for (const name in this.stores) {
            const store = this.stores[name]
            if (store.__wasHotReloaded) {
              continue
            }
            unmountStore(name, store)
          }
        }

        onWillReloadStores() {
          storeHMRCache[this.props.__hmrPath] = this.stores
        }

        childContextStores(parentStores) {
          if (options.warnOnOverwriteStore && parentStores) {
            for (const name in Stores) {
              if (!parentStores[name]) continue
              console.log(`Overwriting existing store ${name} via ${Klass.name}`)
            }
          }
          const names = Object.keys(Stores)
          const childStores = {}
          for (const name of names) {
            childStores[name] = this.stores[name]
          }
          const stores = {
            ...parentStores,
            ...childStores,
          }
          return stores
        }

        render() {
          clearTimeout(this.clearUnusedStores)
          const { __contextualStores, __hmrPath, ...props } = this.props
          const children = <Klass {...props} {...this.stores} />
          if (context) {
            const childStores = this.childContextStores(__contextualStores)
            return <StoreContext.Provider value={childStores}>{children}</StoreContext.Provider>
          }
          return children
        }
      }

      let StoreProviderWithContext: any = StoreProvider

      // we need to merge parent stores down
      if (context) {
        StoreProviderWithContext = props => (
          <StoreContext.Consumer>
            {stores => {
              const contextProps = stores ? { __contextualStores: stores } : null
              return <StoreProvider {...contextProps} {...props} />
            }}
          </StoreContext.Consumer>
        )
      }

      // hmr keypath for dev mode
      const WithPath =
        process.env.NODE_ENV !== 'development'
          ? StoreProviderWithContext
          : props => (
              <StoreHMR key={Klass.__hmrId}>
                <StoreProviderWithContext {...props} />
              </StoreHMR>
            )

      return new Proxy(WithPath, {
        set(_, method, value) {
          Klass[method] = value
          WithPath[method] = value
          return true
        },
      })
    },
  }
}
