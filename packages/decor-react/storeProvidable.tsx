import * as React from 'react'
import * as Mobx from 'mobx'
import root from 'global'
import { StoreContext } from './contexts'
import { Disposable } from 'event-kit'
import { updateProps } from './helpers/updateProps'
import { getUniqueDOMPath } from './helpers/getUniqueDOMPath'
import { getNonReactElementProps } from './helpers/getNonReactElementProps'
import { StoreHMR } from '@mcro/store-hmr'

root.loadedStores = new Set()
const storeHMRCache = root.storeHMRCache || {}
root.storeHMRCache = storeHMRCache

export function storeProvidable(options, Helpers) {
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

      // return HoC
      class StoreProvider extends React.PureComponent {
        id = Math.random()
        props: any | { __contextualStores?: Object }
        _props: any
        stores: any
        willReloadListener: Disposable
        allStores = allStores
        getUniqueDOMPath = getUniqueDOMPath

        state = {
          key: null,
        }

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

        // DO NOT USE CLASS PROPERTY DECORATORS FOR THIS, IDK WTF WHY
        setupStores() {
          if (storeHMRCache[this.props.__hmrPath]) {
            this.restoreStores()
            return
          }
          const getProps = {
            configurable: true,
            get: () => this._props,
            set() {
              /* ignore */
            },
          }
          // create stores
          this.stores = {}
          for (const name in Stores) {
            const Store = Stores[name]
            Object.defineProperty(Store.prototype, 'props', getProps)
            const store = new Store()
            Object.defineProperty(store, 'props', getProps)
            this.stores[name] = store
          }
          this.willMountStores()
        }

        restoreStores() {
          this.stores = storeHMRCache[this.props.__hmrPath]
          setTimeout(() => {
            delete storeHMRCache[this.props.__hmrPath]
          })
        }

        willMountStores() {
          if (!options.onStoreMount) {
            return
          }
          for (const name of Object.keys(this.stores)) {
            if (!this.stores[name].__hasMounted) {
              options.onStoreMount(this.stores[name], this.props)
            }
            this.stores[name].__hasMounted = true
          }
        }

        didMountStores() {
          for (const name in this.stores) {
            const store = this.stores[name]
            if (Helpers) {
              Helpers.emit('store.mount', { name, thing: store })
            }
            if (options.onStoreDidMount) {
              options.onStoreDidMount(store, this.props)
            }
          }
        }

        disposeStores = () => {
          for (const name in this.stores) {
            const store = this.stores[name]
            if (Helpers) {
              Helpers.emit('store.unmount', { name, thing: store })
            }
            if (options.onStoreUnmount) {
              options.onStoreUnmount(store)
            }
          }
        }

        onWillReloadStores = () => {
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
          <StoreProviderWithContext {...props} />
        </StoreHMR>
      )

      return new Proxy(WithPath, {
        set(_, method, value) {
          Klass[method] = value
          StoreProviderWithContext[method] = value
          return true
        },
      })
    },
  }
}
