import * as React from 'react'
import * as Mobx from 'mobx'
import root from 'global'
import { StoreContext } from './contexts'
import { Disposable } from 'event-kit'
import { updateProps } from './helpers/updateProps'
import { getUniqueDOMPath } from './helpers/getUniqueDOMPath'
import { getNonReactElementProps } from './helpers/getNonReactElementProps'
import { StoreHMR } from '@mcro/store-hmr'
import debug from '@mcro/debug'
import { throttle } from 'lodash'
import hashSum from 'hash-sum'

const log = debug('storeProvidable')
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

  let hmrRunning = null

  // to track and dispose old stores after hmr
  Helpers.on(
    'will-hmr',
    throttle(() => {
      hmrRunning = {}
      // after hmr, clean up non hot-swapped stores
      setTimeout(() => {
        for (const namespace in storeHMRCache) {
          for (const storeName in storeHMRCache[namespace]) {
            const store = storeHMRCache[namespace][storeName]
            if (!store.__wasHotReloaded) {
              options.onStoreUnmount(store)
            }
          }
        }
        root.storeHMRCache = {}
        hmrRunning = null
      }, 300)
    }, 80),
  )

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

      Klass.__hmrId = 0

      // return HoC
      // dont use class properties on this, react-hot-loader seems to pick it up even if cold()

      class StoreProvider extends React.Component {
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
          // 🐛 one: hmr runs constructor twice on hmr.... why?? no docs anywhere
          // for some reason this runs twice on hmr causing mayhem
          // so prevent that in a hacky ass way
          if (hmrRunning) {
            const key = hashSum(this)
            if (!hmrRunning[key]) {
              hmrRunning[key] = true
              return
            }
          }
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
                  nextStore.constructor.toString() ===
                  cachedStores[name].constructor.toString()
                ) {
                  // we have a hydratable store, hot swap it in!
                  this.stores[name] = cachedStores[name]
                  this.stores[name].__test = hashSum(this)
                  cachedStores[name].__wasHotReloaded = true
                  // be sure to clean up the temporary unused comparison store
                  options.onStoreUnmount(nextStore)
                } else {
                  cachedStores[name].__wasHotReloaded = false
                  Klass.__hmrId = Math.random()
                  // 🐛 two: maybe this is my fault, but again stores are left around
                  // but because we force a key update in the line above so it will re-render
                  this.clearUnusedStores = setTimeout(() => {
                    this.disposeStores()
                  }, 200)
                }
              }
            }

            // we didn't hydrate it from hmr, set it up normally
            if (!this.stores[name]) {
              this.stores[name] = nextStore
              options.onStoreMount(nextStore, this.props)
              // only update if it re-mounted (TEST)
              Helpers.emit('store.mount', { name, thing: nextStore })
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
            if (Helpers) {
              Helpers.emit('store.unmount', { name, thing: store })
            }
            options.onStoreUnmount(store)
          }
        }

        onWillReloadStores() {
          storeHMRCache[this.props.__hmrPath] = this.stores
        }

        childContextStores(parentStores) {
          if (options.warnOnOverwriteStore && parentStores) {
            for (const name in Stores) {
              if (!parentStores[name]) continue
              console.log(
                `Overwriting existing store ${name} via ${Klass.name}`,
              )
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
            return (
              <StoreContext.Provider value={childStores}>
                {children}
              </StoreContext.Provider>
            )
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
              const contextProps = stores
                ? { __contextualStores: stores }
                : null
              return <StoreProvider {...contextProps} {...props} />
            }}
          </StoreContext.Consumer>
        )
      }

      const WithPath = props => (
        <StoreHMR>
          <StoreProviderWithContext key={Klass.__hmrId} {...props} />
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
