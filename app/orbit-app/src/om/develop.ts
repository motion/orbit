import { observeMany, OrbitHot } from '@o/kit'
import { AppDefinition, BuildStatus, BuildStatusModel } from '@o/models'
import { Desktop } from '@o/stores'
import { stringToIdentifier } from '@o/ui'
import { difference } from 'lodash'
import { reaction } from 'mobx'
import { Action, AsyncAction } from 'overmind'

export type DevMode = 'development' | 'production'
export type DevelopState = {
  started: boolean
  buildStatus: BuildStatus[]
  appModules: AppDefinition[]
}

export const state: DevelopState = {
  started: false,
  appModules: [],
  buildStatus: [],
}

const start: AsyncAction = async om => {
  // load buildStatus at least once before starting
  await new Promise(res => {
    // observe changes
    observeMany(BuildStatusModel).subscribe(status => {
      om.actions.develop.updateStatus({ status })
      res()
    })
  })

  // setup apps
  await om.actions.develop.loadApps()

  // watch for development state
  om.actions.develop.updateDevState()
  reaction(
    () => Desktop.state.workspaceState.options.dev,
    () => om.actions.develop.updateDevState(),
    {
      fireImmediately: true,
    },
  )
}

const updateDevState: Action = () => {
  // @ts-ignore
  window.__DEV__ = Desktop.state.workspaceState.options.dev
}

const getIdentifiers = (x: BuildStatus[]) => x.map(x => x.identifier)

const isAppIdentifier = (id: string) => {
  return !!Desktop.state.workspaceState.identifierToPackageId[id]
}

const updateStatus: AsyncAction<{
  status: BuildStatus[]
}> = async (om, { status }) => {
  if (!om.state.develop.started) {
    om.state.develop.started = true
    om.state.develop.buildStatus = status
    // avoid running update on inital load, we serve it in proper state already
    return
  }

  const current = om.state.develop.buildStatus
  const next = status

  // persist the last buildStatus immediately
  // this will be sure we don't redo things unecessarily if called in quick succession
  // as it does when webpack sees a few build events come in at once
  om.state.develop.buildStatus = status

  // then, load new app js bundles if they were just added
  await om.actions.develop.loadNewAppDLLs({ current, next })

  // then, check if we toggled from dev/prod and properly update
  await om.actions.develop.updateAppsBuildMode({ current, next })
}

type UpdateBuildStatusDesc = { current: BuildStatus[]; next: BuildStatus[] }

const loadNewAppDLLs: AsyncAction<UpdateBuildStatusDesc> = async (om, { current, next }) => {
  const currentIds = getIdentifiers(current)
  const nextIds = getIdentifiers(next)
  const toAdd = difference(nextIds, currentIds).filter(isAppIdentifier)
  if (!toAdd.length) return
  // loop and load new app dlls
  // TODO promise.all this probably
  for (const identifier of toAdd) {
    console.debug(`Loading a new app DLL: ${identifier}`)
    const packageId = Desktop.state.workspaceState.identifierToPackageId[identifier]
    if (!packageId) {
      console.error('Couldnt find it tho')
      return
    }
    const name = stringToIdentifier(packageId)
    // load the new script
    const buildInfo = next.find(x => x.identifier === identifier)!
    await om.actions.develop.loadAppDLL({ name, mode: buildInfo.mode })
    // then load apps
    await om.actions.develop.loadApps()
  }
}

const updateAppsBuildMode: AsyncAction<UpdateBuildStatusDesc> = async (om, { current, next }) => {
  const currentIds = getIdentifiers(current.filter(x => x.mode === 'development'))
  const nextIds = getIdentifiers(next.filter(x => x.mode === 'development'))

  // load new app scripts
  const toAdd = difference(nextIds, currentIds).filter(isAppIdentifier)
  const toRemove = difference(currentIds, nextIds).filter(isAppIdentifier)

  if (!toAdd.length && !toRemove.length) {
    return
  }

  const all = [...current, ...next]

  await Promise.all([
    [...toAdd, ...toRemove].map(identifier => {
      const buildStatus = all.find(x => x.identifier === identifier)!
      om.actions.develop.changeAppDevelopmentMode(buildStatus)
    }),
  ])

  // we have an update
  await om.actions.develop.loadApps()
}

const changeAppDevelopmentMode: AsyncAction<BuildStatus> = async (om, { identifier, mode }) => {
  const packageId = Desktop.state.workspaceState.identifierToPackageId[identifier]
  if (!packageId) return
  const name = stringToIdentifier(packageId)

  // wait until new bundle loaded
  await new Promise(res => {
    const observer = observeMany(BuildStatusModel).subscribe(next => {
      if (
        next.some(x => {
          return x.status === 'complete' && x.mode === mode && x.identifier === identifier
        })
      ) {
        observer.unsubscribe()
        res()
      }
    })
  })

  // close old hot event listener
  OrbitHot.removeHotHandler(name)

  // load the new script
  await om.actions.develop.loadAppDLL({ name, mode })
}

function loadOrReplaceScript(id: string, src: string) {
  const tag = document.getElementById(id)
  return new Promise(res => {
    if (!tag) {
      console.warn('Loading new app', id)
    } else {
      tag.parentNode!.removeChild(tag)
    }
    const body = document.getElementsByTagName('body')[0]
    const script = document.createElement('script')
    script.id = id
    script.src = src
    script.type = 'text/javascript'
    script.addEventListener('load', () => res())
    body.appendChild(script)
  })
}

const loadAppDLL: AsyncAction<{ name: string; mode: DevMode }> = async (_, { name, mode }) => {
  await loadOrReplaceScript(`script_app_${name}`, `/${name}.${mode}.dll.js`)
}

export const loadApps: AsyncAction = async om => {
  // writing our own little System loader
  let nameRegistry = Desktop.state.workspaceState.nameRegistry

  // isolate mode load just one
  if (window.location.pathname.indexOf('/isolate') === 0) {
    nameRegistry = nameRegistry.filter(x => x.identifier === window.location.pathname.split('/')[2])
  }

  om.state.develop.appModules = await Promise.all(
    nameRegistry.map(async ({ buildName, entryPathRelative }) => {
      const appModule = await loadSystemModule(buildName, window)
      return appModule(entryPathRelative)
    }),
  )
}

async function loadSystemModule(name: string, modules: any): Promise<(path: string) => any> {
  return new Promise(res => {
    const appBundle = window['System'].registry[name]
    if (!appBundle) {
      return
    }
    const { args, init } = appBundle
    const { setters, execute } = init(res)
    // adds the dependencies
    for (const [index, arg] of args.entries()) {
      setters[index](modules[arg])
    }
    execute()
  })
}

export const actions = {
  start,
  updateStatus,
  changeAppDevelopmentMode,
  loadAppDLL,
  loadApps,
  loadNewAppDLLs,
  updateDevState,
  updateAppsBuildMode,
}
