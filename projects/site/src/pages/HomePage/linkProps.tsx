import memoize from 'memoize-weak'
import { useCurrentRoute } from 'react-navi'

import { Navigation, routeTable } from '../../Navigation'
import { HeaderContext } from '../../views/Header'

export const LinkState = {
  didAnimateOut: true,
}

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
  const header = HeaderContext.useProps()
  const isActive = useIsActiveRoute(href)
  return {
    ...linkProps(href, header, isActive),
    isActive,
  }
}

let tm = null

export const createLink = memoize((href: string, header = null) => async e => {
  if (isExternal(href)) {
    return
  }
  clearTimeout(tm)
  e.preventDefault()
  // transition out body on slow
  let tm2 = setTimeout(() => {
    document.body.classList.add('will-load')
    document.body.classList.add('loading')
  }, 200)
  const finish = () => {
    Navigation.navigate(href).then(() => {
      clearTimeout(tm2)
      document.body.classList.remove('loading')
      document.body.classList.remove('will-load')
    })
  }
  if (header) {
    header.setShown(false)
    tm = setTimeout(finish, 140)
  } else {
    finish()
  }
})

export const linkProps = (href: string, header?, isActive?): any => {
  return {
    href,
    tagName: 'a',
    ...(!!header && { className: 'will-transform' }),
    textDecoration: 'none',
    cursor: 'pointer',
    target: isExternal(href) ? '_blank' : undefined,
    onClick: isActive ? nullLink : createLink(href, header),
    onMouseEnter: createPreloadLink(href),
  }
}

const isExternal = href => href.indexOf('http') === 0
