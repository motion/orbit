import { createStoreContext } from '@o/use-store'

import { docsItems } from './docsItems'

const getInitialIndex = () => {
  const initialPath = window.location.pathname.replace('/docs/', '')
  const index = docsItems.all.findIndex(x => x['id'] === initialPath)
  return initialPath && index !== -1 ? index : 1
}

class DocsStore {
  initialIndex = getInitialIndex()
  search = ''
  section = 'all'

  setSearch = next => {
    this.search = next
    this.initialIndex = 0
  }

  setSection = next => {
    this.section = next
  }

  toggleSection = val => this.setSection(this.section === val ? 'all' : val)
}

export const DocsStoreContext = createStoreContext(DocsStore)
