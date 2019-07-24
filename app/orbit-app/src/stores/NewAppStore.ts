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
      return
    }

    // update name and colors
    let name = nextDef.name || this.app.name
    let colors = nextDef.iconColors || this.app.colors

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
