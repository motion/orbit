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
  app: GenericApp = defaultApps[0]

  update(app: Partial<App>) {
    this.app = {
      ...this.app,
      ...app,
    }
  }

  setApp(type: AppType) {
    this.app = {
      ...this.app,
      type,
    }
  }

  reset = () => {
    this.app = defaultApps[0]
  }
}
