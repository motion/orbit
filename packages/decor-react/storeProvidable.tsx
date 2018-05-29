import * as React from 'react'
import * as Mobx from 'mobx'
import pickBy from 'lodash/pickBy'
import difference from 'lodash/difference'
import isEqual from 'lodash/isEqual'
import root from 'global'
import { DecorPlugin } from '@mcro/decor'
import { StoreContext } from './contexts'

// keep action out of class directly because of hmr bug
const updateProps = Mobx.action('updateProps', (props, nextProps) => {
  const curPropKeys = Object.keys(props)
  const nextPropsKeys = Object.keys(nextProps)
  // change granular so reactions are granular
  for (const prop of nextPropsKeys) {
    if (!isEqual(props[prop], nextProps[prop])) {
      props[prop] = nextProps[prop]
    }
  }
  // remove
  for (const extraProp of difference(curPropKeys, nextPropsKeys)) {
    props[extraProp] = undefined
  }
})

// @ts-ignore
root.loadedStores = new Set()
const storeHMRCache = {}

export interface StoreProvidable {}

export let storeProvidable: DecorPlugin<StoreProvidable>

storeProvidable = function(options, Helpers) {
  return {
    name: 'store-providable',
    once: true,
    onlyClass: true,
    decorator: (Klass, opts: any = {}) => {
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
      class StoreProvider extends React.Component implements StoreProvidable {
        props: any | { __contextualStores?: Object }
        hmrDispose: any
        _props: any
        mounted: boolean
        stores: any
        unmounted: boolean

        // @ts-ignore
        static get name() {
          return Klass.name
        }

        get name() {
          return Klass.name
        }

        allStores = allStores
        storeHMRCache = {}

        // onWillReload() {
        //   this.onWillReloadStores()
        //   this.disposeStores()
        //   this.setupProps()
        //   this.setupStores()
        //   this.mountStores()
        //   this.forceUpdate()
        // }

        constructor(a, b) {
          super(a, b)
          if (Klass.name === 'PaneStore') {
            console.log('storeprovidable mount', Klass.name, Stores)
          }
          this.setupProps()
          this.setupStores()
          this.unmounted = false
        }

        // PureComponent means this is only called when props are not shallow equal
        componentDidUpdate(nextProps) {
          updateProps(this._props, nextProps)
        }

        componentDidMount() {
          if (this.stores === null) {
            return
          }
          root.loadedStores.add(this)
          this.mounted = true
          this.mountStores()
          Helpers.on('will-hmr', this.onWillReloadStores)
          Helpers.on('did-hmr', this.onReloadStores)
        }

        componentWillUnmount() {
          root.loadedStores.delete(this)
          // if you remove @view({ store: ... }) it tries to remove it here but its gone
          if (this.disposeStores) {
            this.disposeStores()
            this.unmounted = true
            if (this.hmrDispose) {
              this.hmrDispose.dispose()
            }
          }
        }

        // for reactive props in stores
        // 🐛 must run this before this.setupStore()
        setupProps() {
          if (!this._props) {
            Mobx.extendObservable(this, { _props: { ...this.props } })
          }
        }

        // DO NOT USE CLASS PROPERTY DECORATORS FOR THIS, IDK WTF WHY
        setupStores() {
          const getProps = {
            get: () => this._props,
            configurable: true,
          }

          // start stores
          const stores = Object.keys(Stores).reduce((acc, cur) => {
            const Store = Stores[cur]
            const createStore = () => {
              if (!Store.prototype) {
                throw new Error(
                  `Store has no prototype from ${this.name}: ${cur}`,
                )
              }
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
                options.onStoreMount.call(
                  stores[name],
                  name,
                  stores[name],
                  this.props,
                ) || stores[name]
            }
          }

          this.stores = stores
        }

        mountStores() {
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

        disposeStores() {
          if (!this.stores) {
            console.log('no stores to dispose')
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

        onWillReloadStores() {
          console.log('will reload, dehydrating')
          if (!this.stores) {
            return
          }
          for (const name of Object.keys(this.stores)) {
            const store = this.stores[name]
            // pass in state + auto dehydrate
            storeHMRCache[name] = {
              state: store.dehydrate(),
            }
            if (store.onWillReload) {
              store.willReload(storeHMRCache[name])
            }
          }
        }

        onReloadStores() {
          console.log('did reload, rehydrating')
          if (!this.stores) {
            return
          }
          for (const name of Object.keys(this.stores)) {
            const store = this.stores[name]
            if (!storeHMRCache[name]) {
              console.log('no hmr state for', name)
              continue
            }
            // auto rehydrate
            if (storeHMRCache[name].state) {
              store.hydrate(storeHMRCache[name].state)
            }
            if (store.onReload) {
              store.onReload()
            }
          }
        }

        childContextStores() {
          const parentStores = this.props.__contextualStores
          if (options.warnOnOverwriteStore && parentStores) {
            Object.keys(Stores).forEach(name => {
              if (parentStores[name]) {
                console.log(
                  `Notice! You are overwriting an existing store in provide. This may be intentional: ${name} from ${
                    Klass.name
                  }`,
                )
              }
            })
          }
          const names = Object.keys(Stores)
          const stores = {
            ...parentStores,
            ...pickBy(this.stores, (_, key) => names.indexOf(key) >= 0),
          }
          return stores
        }

        render() {
          const { __contextualStores, ...props } = this.props
          const children = <Klass {...props} {...this.stores} />
          if (context) {
            return (
              <StoreContext.Provider value={this.childContextStores()}>
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
            {stores => <StoreProvider __contextualStores={stores} {...props} />}
          </StoreContext.Consumer>
        )
      }

      return new Proxy(StoreProviderWithContext, {
        set(_, method, value) {
          Klass[method] = value
          return true
        },
      })
    },
  }
}
