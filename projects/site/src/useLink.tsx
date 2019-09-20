import memoize from 'memoize-weak'
import { useCurrentRoute } from 'react-navi'

import { LinkState } from './LinkState'
import { routeTable } from './routeTable'
import { HeaderContext } from './views/HeaderContext'

const getNavigation = () => window['Navigation']

const isOnRoute = (path, route) => route.url.pathname === path

export const useIsActiveRoute = (href: string) => {
  const route = useCurrentRoute()
  return isOnRoute(href, route)
}
const nullLink = e => e.preventDefault()
const loadedRoutes = {}

const createPreloadLink = memoize(href => () => {
  // pre load pages on hover
  if (loadedRoutes[href]) {
    return
  }
  if (routeTable[href]) {
    routeTable[href]().then(x => {
      const theme = Object.keys(x).reduce((a, k) => a || x[k].theme, null)
      loadedRoutes[href] = theme
    })
  }
})

export const useLink = (href: string) => {
  const header = HeaderContext.useStore()
  const isActive = useIsActiveRoute(href)
  return {
    ...linkProps(href, { header, isActive }),
    isActive,
  }
}

let tm = null

export const createLink = memoize((href: string, header = null, isExternal = false) => async e => {
  if (isExternal || checkExternal(href)) {
    return
  }
  if (e.metaKey || e.ctrlKey) {
    return
  }
  clearTimeout(tm)
  e.preventDefault()
  if (loadedRoutes[href] || !header) {
    LinkState.didAnimateOut = false
    getNavigation().navigate(href)
  } else {
    LinkState.didAnimateOut = true
    // transition out body on slow
    let tm2 = setTimeout(() => {
      document.body.classList.add('will-load')
      document.body.classList.add('loading')
    }, 200)
    header.setShown(false)
    tm = setTimeout(() => {
      getNavigation()
        .navigate(href)
        .then(() => {
          clearTimeout(tm2)
          document.body.classList.remove('loading')
          document.body.classList.remove('will-load')
        })
    }, 105)
  }
})

export const linkProps = (
  href: string,
  opts: {
    header?: any
    isActive?: boolean
    isExternal?: boolean
  } = {},
): any => {
  return {
    href,
    tagName: 'a',
    ...(!!opts.header && { className: 'will-transform' }),
    textDecoration: 'none',
    cursor: 'pointer',
    target: opts.isExternal || checkExternal(href) ? '_blank' : undefined,
    onClick: opts.isActive ? nullLink : createLink(href, opts.header, opts.isExternal),
    onMouseEnter: createPreloadLink(href),
  }
}
const checkExternal = href => href.indexOf('http') === 0 || href.indexOf('mailto') === 0
