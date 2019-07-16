import { AppBit } from '@o/models'

import { getUserAppDefinitions } from '../apps/orbitApps'

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
    const userDefs = getUserAppDefinitions()
    const nextDef = userDefs.find(x => x.id === identifier)
    if (!nextDef) {
      console.warn('no app', nextDef)
      return
    }

    // update name and colors if unedited
    let name = this.app.name
    let colors = nextDef.iconColors || this.app.colors
    const app = userDefs.find(x => x.id === this.app.identifier)
    const neverChangedName = name === app ? app!.name : ''
    if (neverChangedName) {
      name = nextDef.name
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
    const initialDef = getUserAppDefinitions()[0]
    this.app = {
      target: 'app',
      name: initialDef.name,
      identifier: initialDef.id,
      colors: ['yellow', 'red'],
    }
  }
}
