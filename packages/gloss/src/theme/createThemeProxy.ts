import { CompiledTheme } from './createTheme'
import { OriginalPropsSymbol, ThemeTrackState, UnwrapThemeSymbol } from './useTheme'

const fakeObj = {}
const proxyThemeDescriptor = { enumerable: true, configurable: true }
export const UpdateProxySymbol = Symbol('UpdateProxySymbol')

export function createThemeProxy(
  theme: CompiledTheme,
  trackState: ThemeTrackState,
  props?: any,
): any {
  let keys: any
  return new Proxy(fakeObj, {
    // fake an object but return props keys
    // because react freezes props we cant fallback to theme if we proxy props directly
    // but since useTheme() is used in limited ways, this seems to work nicely
    ownKeys() {
      keys = keys || Object.keys(props || fakeObj)
      return keys
    },
    getOwnPropertyDescriptor() {
      return proxyThemeDescriptor
    },
    set(_, key, value) {
      // allow updating props
      if (key === UpdateProxySymbol) {
        if (props != value[0]) {
          props = value[0]
          keys = Object.keys(props)
        }
        theme = value[1]
        return true
      }
      throw new Error(`Don't set on theme!`)
    },
    get(_, key) {
      if (key === UnwrapThemeSymbol) {
        return theme
      }
      if (key === OriginalPropsSymbol) {
        return props
      }
      // props override theme values here
      // TODO we need to do all the css conversions here
      // we can share styleVal probably to do stuff like color => Color
      // need to figure out how we know to do that...
      if (props) {
        if (Reflect.has(props, key)) {
          let next = Reflect.get(props, key)
          if (next !== undefined) {
            if (theme && typeof next === 'function' && Reflect.has(theme, key)) {
              // resolve functions
              next = next(theme)
            }
            // we need to know if they use props, so we can determine if we need to bail
            if (typeof key === 'string') {
              markNonCSS(trackState, key as any)
            }
            return next
          }
        }
      }
      if (theme) {
        if (key[0] === '_' || !Reflect.has(theme, key)) {
          return Reflect.get(theme, key)
        }
        const val = Reflect.get(theme, key)
        if (val && val.cssVariable) {
          return new Proxy(val, {
            get(starget, skey) {
              if (Reflect.has(starget, skey)) {
                const val = Reflect.get(starget, skey)
                if (val === undefined) {
                  return val
                }
                if (skey === 'cssVariable') {
                  // unwrap
                  return starget[skey]
                }
                if (typeof key === 'string' && typeof skey === 'string') {
                  if (!starget.cssVariableSafeKeys.includes(skey)) {
                    markNonCSS(trackState, key)
                  }
                }
                return val
              }
            },
          })
        } else {
          if (val !== undefined && typeof key === 'string') {
            markNonCSS(trackState, key)
          }
          return val
        }
      }
    },
  })
}

function markNonCSS(trackState: ThemeTrackState, key: string) {
  trackState.nonCSSVariables.add(key)
  trackState.hasUsedOnlyCSSVariables = false
}
