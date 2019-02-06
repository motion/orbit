import { App, AppType, BaseApp } from '@mcro/models'

export const defaultApps: App[] = [
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

type GenericApp = BaseApp & { data: any; type: string }

export class NewAppStore {
  showCreateNew = false

  setShowCreateNew = (val: boolean) => {
    this.showCreateNew = val
  }

  app: GenericApp = defaultApps[0]

  update(app: Partial<App>) {
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
      type,
      name,
      colors,
    }
  }

  reset = () => {
    this.app = defaultApps[0]
  }
}
