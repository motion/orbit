import * as React from 'react'
import { findDOMNode } from 'react-dom'
import * as Mobx from 'mobx'
import difference from 'lodash/difference'
import isEqual from 'react-fast-compare'
import root from 'global'
import { DecorPlugin } from '@mcro/decor'
import { StoreContext } from './contexts'
import { Disposable } from 'event-kit'

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

function getElementIndex(node: Element) {
  var index = 0
  while ((node = node.previousElementSibling)) {
    index++
  }
  return index
}

function getName(mountedComponent) {
  const node = findDOMNode(mountedComponent) as HTMLElement
  let name = `${mountedComponent.name}`
  let parent = node
  while (parent && parent instanceof HTMLElement && parent.tagName !== 'HTML') {
    name += parent.nodeName + getElementIndex(parent)
    parent = parent.parentNode as HTMLElement
  }
  return name
}

let StoreDisposals = new Set()

root.loadedStores = new Set()
const storeHMRCache = root.storeHMRCache || {}
root.storeHMRCache = storeHMRCache

export interface StoreProvidable {}

export let storeProvidable: DecorPlugin<StoreProvidable>

storeProvidable = function(options, Helpers) {
  let recentHMR = false
  let recentHMRTm = null

  // let things re-mount after queries and such
  const setRecentHMR = () => {
    console.log('set recent HMR')
    clearTimeout(recentHMRTm)
    recentHMR = true
    recentHMRTm = setTimeout(() => {
      recentHMR = false
    }, 2000)
  }

  Helpers.on('did-hmr', setRecentHMR)

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
        isSetup = false
        id = Math.random()

        props: any | { __contextualStores?: Object }
        hmrDispose: any
        _props: any
        stores: any
        unmounted: boolean
        willReloadListener: Disposable

        // @ts-ignore
        static get name() {
          return Klass.name
        }

        get name() {
          return Klass.name
        }

        allStores = allStores

        constructor(a, b) {
          super(a, b)
          this.setupProps()
          this.setupStores()
          this.isSetup = true
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
          if (this.stores === null) {
            return
          }
          root.loadedStores.add(this)
          this.mountStores()
          this.willReloadListener = Helpers.on('will-hmr', () => {
            if (this.stores.peekStore) {
              console.log('WILL UNMOUNT')
            }
            setRecentHMR()
            this.onWillReloadStores()
          })
          if (this.stores.peekStore) {
            console.log('DID MOUNT', recentHMR)
          }
          if (recentHMR) {
            this.onReloadStores()
          }
        }

        componentWillUnmount() {
          this.willReloadListener.dispose()
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

        disposeStores = () => {
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

        onWillReloadStores = () => {
          if (!this.stores) {
            return
          }
          for (const name of Object.keys(this.stores)) {
            const store = this.stores[name]
            // pass in state + auto dehydrate
            // to get real key: findDOMNode(this) + serialize dom position into key
            storeHMRCache[`${getName(this)}${name}`] = {
              state: store.dehydrate(),
            }
            if (store.onWillReload) {
              store.willReload(storeHMRCache[name])
            }
          }
          // save these for later because webpack may not actually HMR
          // if there is "nothing to update", it will not call `onReloadStores`
          // so we don't want to dispose prematurely
          StoreDisposals.add(this.disposeStores)
        }

        onReloadStores = () => {
          if (!this.stores) {
            return
          }
          for (const disposer of StoreDisposals) {
            disposer()
          }
          StoreDisposals = new Set()
          for (const name of Object.keys(this.stores)) {
            const store = this.stores[name]
            const key = `${getName(this)}${name}`
            if (name === 'peekStore') {
              console.log('RELOADING')
              console.log(key, storeHMRCache[key])
            }
            if (!storeHMRCache[key]) {
              // try again a bit later, perhaps it wasnt mounted
              // console.log('no hmr state for', name, key, storeHMRCache)
              continue
            }
            // auto rehydrate
            if (storeHMRCache[key].state) {
              store.hydrate(storeHMRCache[key].state)
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
          return true
        },
      })
    },
  }
}
