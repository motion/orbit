import { getAppDefinition, save } from '@o/kit'
import { AppBit, AppModel } from '@o/models'
import { Action } from 'overmind'
import { spaceStore } from './stores'

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

type State = {
  app: AppBit
}

export const state: State = {
  app: defaultApps[0],
}

const update: Action<Partial<AppBit>> = ({ state }, app) => {
  state.setupApp.app = {
    ...state.setupApp.app,
    ...app,
  }
}

const setApp: Action<string> = ({ state }, identifier) => {
  const app = state.setupApp.app
  const nextApp = defaultApps.find(x => x.identifier === identifier)
  console.log('next app', nextApp)
  if (!nextApp) {
    console.warn('no app', nextApp)
    return
  }

  // update name and colors if unedited
  let name = app.name
  let colors = app.colors
  const neverChangedName = name === defaultApps.find(x => x.identifier === app.identifier).name
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

  state.setupApp.app = {
    ...app,
    // update if not changed
    name,
    colors,
    // always update
    identifier,
    data,
  }
}

const reset: Action = ({ state }) => {
  state.setupApp.app = defaultApps[0]
}

const create: Action<string> = async (om, identifier) => {
  await om.effects.setupApp.createCustomApp(identifier)
  om.actions.setupApp.reset()
}

export const actions = {
  update,
  setApp,
  reset,
  create,
}

export const effects = {
  async createCustomApp(identifier: string) {
    await save(AppModel, {
      name: 'My Custom App',
      spaceId: spaceStore.activeSpace.id,
      identifier: identifier || `custom`,
      colors: ['green', 'darkgreen'],
    })
  },
}
