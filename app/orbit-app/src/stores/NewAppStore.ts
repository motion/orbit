import { AppBit } from '@o/models'

import { getUserApps } from '../apps/orbitApps'

export class NewAppStore {
  app: AppBit = {
    target: 'app',
    identifier: 'custom',
    colors: ['red', 'orange'],
  }

  update(app: Partial<AppBit>) {
    this.app = {
      ...this.app,
      ...app,
    }
  }

  setApp(identifier: string) {
    this.reset()
    const userApps = getUserApps()
    const nextApp = userApps.find(x => x.id === identifier)
    if (!nextApp) {
      console.warn('no app', nextApp)
      return
    }

    // update name and colors if unedited
    let name = this.app.name
    let colors = this.app.colors
    const app = userApps.find(x => x.id === this.app.identifier)
    const neverChangedName = name === app ? app!.name : ''
    if (neverChangedName) {
      name = nextApp.name
    }

    this.app = {
      ...this.app,
      // update if not changed
      name,
      colors,
      // always update
      identifier,
      data: {},
    }
  }

  reset = () => {
    const initialDef = getUserApps()[0]
    this.app = {
      target: 'app',
      name: initialDef.name,
      identifier: initialDef.id,
      colors: ['yellow', 'red'],
    }
  }
}
