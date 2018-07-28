import * as React from 'react'
import * as Mobx from 'mobx'
import root from 'global'
import { StoreContext } from './contexts'
import { Disposable } from 'event-kit'
import { updateProps } from './helpers/updateProps'
import { getUniqueDOMPath } from './helpers/getUniqueDOMPath'
import { getNonReactElementProps } from './helpers/getNonReactElementProps'
import debug from '@mcro/debug'

const log = debug('storeProvidable')

root.loadedStores = new Set()
const storeHMRCache = root.storeHMRCache || {}
root.storeHMRCache = storeHMRCache

let recentHMR = false
let recentHMRTm = null
// let things re-mount after queries and such
const setRecentHMR = () => {
  clearTimeout(recentHMRTm)
  recentHMR = true
  recentHMRTm = setTimeout(() => {
    recentHMR = false
    // @ts-ignore
    window.render()
  }, 1000)
}

export function storeProvidable(options, Helpers) {
  Helpers.on('did-hmr', setRecentHMR)

  return {
    name: 'store-providable',
    once: true,
    decorator: (Klass, opts: any = {}) => {
      const allStores = opts.stores || options.stores
      const logName = `${Object.keys(allStores || {}).join(', ')}`

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
      class StoreProvider extends React.Component {
        id = Math.random()
        props: any | { __contextualStores?: Object }
        _props: any
        stores: any
        unmounted: boolean
        willReloadListener: Disposable
        allStores = allStores

        constructor(a, b) {
          super(a, b)
          log(`${logName}.constructor`)
          this.setupProps()
          this.setupStores()
        }

        // PureComponent means this is only called when props are not shallow equal
        componentDidUpdate() {
          updateProps(this._props, this.props)
          // update even later because the hydrations change props and renders, changing the key path
          if (recentHMR) {
            this.onReloadStores()
          }
        }

        componentDidMount() {
          if (!this.stores) {
            return
          }
          root.loadedStores.add(this)
          this.didMountStores()
          this.willReloadListener = Helpers.on('will-hmr', () => {
            setRecentHMR()
            this.onWillReloadStores()
          })
          if (recentHMR) {
            this.onReloadStores()
          }
        }

        componentWillUnmount() {
          if (this.willReloadListener) {
            this.willReloadListener.dispose()
          }
          root.loadedStores.delete(this)
          // if you remove @view.attach({ store: ... }) it tries to remove it here but its gone
          if (this.disposeStores) {
            this.disposeStores()
            this.unmounted = true
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

        willMountStores() {
          if (!options.onStoreMount) {
            return
          }
          log(`${logName}.willMountStores`)
          for (const name of Object.keys(this.stores)) {
            if (!this.stores[name].__hasMounted) {
              options.onStoreMount(this.stores[name], this.props)
            }
            this.stores[name].__hasMounted = true
          }
        }

        didMountStores() {
          if (!this.stores) {
            return
          }
          for (const name of Object.keys(this.stores)) {
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
          if (!this.stores) {
            return
          }
          for (const name of Object.keys(this.stores)) {
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
          if (!this.stores) {
            return
          }
          log(`${logName}.onWillReloadStores`)
          for (const name of Object.keys(this.stores)) {
            const store = this.stores[name]
            // pass in state + auto dehydrate
            // to get real key: findDOMNode(this) + serialize dom position into key
            storeHMRCache[`${getUniqueDOMPath(this)}${name}`] = {
              state: store.dehydrate(),
            }
          }
        }

        onReloadStores = () => {
          if (!this.stores) {
            return
          }
          log(`${logName}.onReloadStores`)
          // dipose now because we are definitely re-hydrating
          for (const name of Object.keys(this.stores)) {
            const store = this.stores[name]
            const key = `${getUniqueDOMPath(this)}${name}`
            if (!storeHMRCache[key]) {
              // try again a bit later, perhaps it wasnt mounted
              // console.log('no hmr state for', name, key, storeHMRCache)
              continue
            }
            // auto rehydrate
            const hydrateState = storeHMRCache[key].state
            if (hydrateState) {
              // remove once its hydrated once
              delete storeHMRCache[key]
              store.hydrate(hydrateState)
              Helpers.emit('store.mount', { name, thing: store })
            }
          }
          // re-run didMount
          this.willMountStores()
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
          const { __contextualStores, ...props } = this.props
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

      return new Proxy(StoreProviderWithContext, {
        set(_, method, value) {
          Klass[method] = value
          StoreProviderWithContext[method] = value
          return true
        },
      })
    },
  }
}
