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

      // ️️⚠️️️⚠️️️⚠️️️⚠️️️⚠️️️⚠️️️⚠️
      // make sure this is static when set here, or hmr wont work
      // ️️⚠️️️⚠️️️⚠️️️⚠️️️⚠️️️⚠️️️⚠️
      Klass.__hmrId = 0
      const updatePropAction = Mobx.action(`${Klass.name}.updateProps`, updateProps)

      // return HoC
      // ️️⚠️️️⚠️️️⚠️️️⚠️️️⚠️️️⚠️️️⚠️
      // dont use class properties on this, react-hot-loader seems to reset it up even if cold()
      // ️️⚠️️️⚠️️️⚠️️️⚠️️️⚠️️️⚠️️️⚠️

      class StoreProvider extends React.PureComponent {
        static contextType = StoreContext

        props: any | { __contextualStores?: Object }
        _props: any
        stores: any
        willReloadListener: Disposable
        clearUnusedStores: any

        // state = {
        //   error: null,
        // }

        get name() {
          return Klass.name
        }

        constructor(a, b) {
          super(a, b)
          Mobx.extendObservable(
            this,
            { _props: getNonReactElementProps(this.props) },
            { _props: Mobx.observable.shallow },
          )
          this.setupStores()
        }

        // PureComponent means this is only called when props are not shallow equal
        componentDidUpdate() {
          updatePropAction(this._props, this.props)
        }

        // componentDidCatch(error) {
        //   this.setState({ error: `${error}` })
        // }

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
          // if you remove @attach({ store: ... }) it tries to remove it here but its gone
          if (this.disposeStores) {
            this.disposeStores()
          }
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
                } else {
                  Klass.__hmrId = Math.random()
                  // 🐛 we force a key update in the line above so it will re-render and check for unused
                  this.clearUnusedStores = setTimeout(() => {
                    console.log('unmounting...', cachedStores[name].constructor.name)
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

        childContextStores() {
          const parentStores = this.context
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
          // if (this.state.error) {
          //   return (
          //     <div style={{ flex: 1, background: 'red', color: '#fff', padding: 10 }}>
          //       {this.state.error}
          //     </div>
          //   )
          // }
          clearTimeout(this.clearUnusedStores)
          const { __hmrPath, ...props } = this.props
          const children = <Klass {...props} {...this.stores} />
          if (context) {
            const childStores = this.childContextStores()
            return <StoreContext.Provider value={childStores}>{children}</StoreContext.Provider>
          }
          return children
        }
      }

      // hmr keypath for dev mode
      const WithPath =
        process.env.NODE_ENV !== 'development'
          ? StoreProvider
          : props => (
              <StoreHMR key={Klass.__hmrId}>
                <StoreProvider {...props} />
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
