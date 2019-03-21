import { getAppDefinition } from '@o/kit'
import { AppBit } from '@o/models'

export const defaultApps: AppBit[] = [
  {
    target: 'app',
    name: 'Search',
    identifier: 'search',
    colors: ['red'],
    data: {},
  },
  {
    target: 'app',
    name: 'List',
    identifier: 'lists',
    colors: ['blue'],
    data: {},
  },
  {
    target: 'app',
    name: 'Directory',
    identifier: 'people',
    colors: ['green'],
    data: {},
  },
  {
    target: 'app',
    name: 'Custom',
    identifier: 'custom',
    colors: ['gray'],
    data: {},
  },
  {
    target: 'app',
    name: 'Custom 2',
    identifier: 'custom2',
    colors: ['gray'],
    data: {},
  },
]

export class NewAppStore {
  showCreateNew = false

  setShowCreateNew = (val: boolean) => {
    this.showCreateNew = val
  }

  app: AppBit = defaultApps[0]

  update(app: Partial<AppBit>) {
    this.app = {
      ...this.app,
      ...app,
    }
  }

  setApp(identifier: string) {
    const nextApp = defaultApps.find(x => x.identifier === identifier)
    console.log('next app', nextApp)
    if (!nextApp) {
      console.warn('no app', nextApp)
      return
    }

    // update name and colors if unedited
    let name = this.app.name
    let colors = this.app.colors
    const neverChangedName =
      name === defaultApps.find(x => x.identifier === this.app.identifier).name
    if (neverChangedName) {
      name = nextApp.name
      colors = nextApp.colors
    }

    // get data from defaultValue
    let data = nextApp.data
    const def = getAppDefinition(identifier)
    if (!def) {
      console.warn('no wapp?')
      return
    }

    if (def.appData) {
      data = def.appData
    }

    this.app = {
      ...this.app,
      // update if not changed
      name,
      colors,
      // always update
      identifier,
      data,
    }
  }

  reset = () => {
    this.app = defaultApps[0]
  }
}
