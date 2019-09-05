import { Navigation } from '../Navigation'
import { docsViews } from './docsItems'

const emptyPromise = () => Promise.resolve({ default: null })

export const loadDocsPage = async view => {
  return await Promise.all([
    view.page().then(x => x.default),
    (view.source || emptyPromise)().then(x => x.default),
    (view.examples || emptyPromise)(),
    (view.examplesSource || emptyPromise)().then(x => x.default),
    (view.types || emptyPromise)().then(x => x.default),
  ])
}

let last = Date.now()
let navTm = null
export const docsNavigate = id => {
  clearTimeout(navTm)
  const isRecent = Date.now() - last < 100
  navTm = setTimeout(
    () => {
      const next = `/docs${id ? `/${id}` : ''}`
      if (window.location.pathname === next) {
        return
      }
      Navigation.navigate(next)
    },
    isRecent ? 150 : 50,
  )
}

let tms = {}

const loadDocPage = (id: string) => {
  tms[id] = setTimeout(() => {
    if (docsViews[id]) {
      loadDocsPage(docsViews[id])
    }
  }, 50)
}

export const preloadItem = item => {
  return {
    onMouseEnter() {
      loadDocPage(item.id)
    },
    onMouseLeave() {
      clearTimeout(tms[item.id])
    },
  }
}
