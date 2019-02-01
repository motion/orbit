import { App, AppType } from '@mcro/models'

export const defaultApps: App[] = [
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
    data: {
      rootItemID: 0,
      items: {},
    },
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
  app: App = defaultApps[0]

  update(app: Partial<App>) {
    this.app = {
      ...this.app,
      ...app,
    } as App
  }

  setApp(type: AppType) {
    this.app = defaultApps.find(x => x.type === type)
  }

  reset = () => {
    this.app = defaultApps[0]
  }
}
