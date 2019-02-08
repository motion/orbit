import { AppBit, AppType } from '@mcro/models'

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
    data: {
      rootItemID: 0,
      items: {},
    },
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
    let name = this.app.name
    let colors = this.app.colors
    const neverChangedName = name === defaultApps.find(x => x.type === this.app.type).name
    if (neverChangedName) {
      name = nextApp.name
      colors = nextApp.colors
    }
    this.app = {
      ...this.app,
      // update if not changed
      name,
      colors,
      // always update
      type,
      data: nextApp.data,
    }
  }

  reset = () => {
    this.app = defaultApps[0]
  }
}
