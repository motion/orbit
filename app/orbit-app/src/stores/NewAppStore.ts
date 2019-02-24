import { useAppPackage } from '@mcro/kit'
import { AppBit } from '@mcro/models'

export const defaultApps: AppBit[] = [
  {
    target: 'app',
    name: 'Search',
    type: 'search',
    colors: ['red'],
    data: {},
  },
  {
    target: 'app',
    name: 'List',
    type: 'lists',
    colors: ['blue'],
    data: {},
  },
  {
    target: 'app',
    name: 'Directory',
    type: 'people',
    colors: ['green'],
    data: {},
  },
  {
    target: 'app',
    name: 'Custom',
    type: 'custom',
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

  setApp(appId: string) {
    const nextApp = defaultApps.find(x => x.type === appId)
    if (!nextApp) {
      console.warn('no next app?')
      debugger
      return
    }

    // update name and colors if unedited
    let name = this.app.name
    let colors = this.app.colors
    const neverChangedName = name === defaultApps.find(x => x.type === this.app.appId).name
    if (neverChangedName) {
      name = nextApp.name
      colors = nextApp.colors
    }

    // get data from defaultValue
    let data = nextApp.data
    const { app } = useAppPackage(appId)
    if (!app) {
      console.warn('no wapp?')
      debugger
      return
    }

    if (app.appData) {
      data = app.appData
    }

    this.app = {
      ...this.app,
      // update if not changed
      name,
      colors,
      // always update
      type: appId,
      data,
    }
  }

  reset = () => {
    this.app = defaultApps[0]
  }
}
