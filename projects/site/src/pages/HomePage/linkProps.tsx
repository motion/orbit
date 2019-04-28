import { ButtonProps } from '@o/ui'
import memoize from 'memoize-weak'
import { useCurrentRoute } from 'react-navi'

import { Navigation, routeTable } from '../../Navigation'
import { HeaderContext } from '../../views/Header'

export const LinkState = {
  didAnimateOut: true,
}

const isOnRoute = (path, route) =>
  path === '/' ? route.url.pathname === path : route.url.pathname.indexOf(path) === 0

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

export const createLink = memoize((href, header = null) => async e => {
  clearTimeout(tm)
  e.preventDefault()
  // if you want fancier transitions
  document.body.classList.add('will-load')
  setTimeout(() => {
    document.body.classList.add('loading')
  })
  const finish = () => {
    Navigation.navigate(href).then(() => {
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

export const linkProps = (href: string, header?, isActive?): ButtonProps => {
  return {
    // @ts-ignore
    href,
    tagName: 'a',
    textDecoration: 'none',
    cursor: 'pointer',
    target: href.indexOf('http') === 0 ? '_blank' : undefined,
    onClick: isActive ? nullLink : createLink(href, header),
    onMouseEnter: createPreloadLink(href),
  }
}
