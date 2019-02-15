import { AppBit } from '@mcro/models'
import { apps } from '../apps/apps'
import { App, AppType } from '../apps/AppTypes'

export const defaultApps: AppBit[] = [
  {
    target: 'app',
    name: 'Search',
    type: AppType.search,
    colors: ['red'],
    data: {},
  },
  {
    target: 'app',
    name: 'List',
    type: AppType.lists,
    colors: ['blue'],
    data: {},
  },
  {
    target: 'app',
    name: 'Directory',
    type: AppType.people,
    colors: ['green'],
    data: {},
  },
  {
    target: 'app',
    name: 'Custom',
    type: AppType.custom,
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

  setApp(type: AppType) {
    const nextApp = defaultApps.find(x => x.type === type)
    if (!nextApp) {
      console.warn('no next app?')
      debugger
      return
    }

    // update name and colors if unedited
    let name = this.app.name
    let colors = this.app.colors
    const neverChangedName = name === defaultApps.find(x => x.type === this.app.type).name
    if (neverChangedName) {
      name = nextApp.name
      colors = nextApp.colors
    }

    // get data from defaultValue
    let data = nextApp.data
    const app = apps[type] as App<any>
    if (app.defaultValue) {
      data = app.defaultValue
    }

    this.app = {
      ...this.app,
      // update if not changed
      name,
      colors,
      // always update
      type,
      data,
    }
  }

  reset = () => {
    this.app = defaultApps[0]
  }
}
