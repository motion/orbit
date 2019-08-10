import { observeMany, OrbitHot } from '@o/kit'
import { AppDefinition, BuildStatus, BuildStatusModel } from '@o/models'
import { Desktop } from '@o/stores'
import { BannerHandle, stringToIdentifier } from '@o/ui'
import { difference } from 'lodash'
import { AsyncAction } from 'overmind'

import { GlobalBanner } from '../pages/OrbitPage/OrbitPage'

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
  // setup apps
  await om.actions.develop.loadApps()

  // observe changes
  observeMany(BuildStatusModel).subscribe(status => {
    om.actions.develop.updateStatus({ status, banner: GlobalBanner })
  })
}

const getDevelopingIdentifiers = (x: BuildStatus[]) =>
  x.filter(x => x.mode === 'development').map(x => x.identifier)

const updateStatus: AsyncAction<{
  status: BuildStatus[]
  banner: BannerHandle | null
}> = async (om, { status, banner }) => {
  if (!om.state.develop.started) {
    om.state.develop.started = true
    // avoid running update on inital load, we serve it in proper state already
    return
  }

  const current = getDevelopingIdentifiers(om.state.develop.buildStatus)
  const next = getDevelopingIdentifiers(status)

  // update state
  om.state.develop.buildStatus = status

  // const mode: DevMode = !!next.length ? 'development' : 'production'
  // load new app scripts
  const toAdd = difference(next, current)
  const toRemove = difference(current, next)

  if (!toAdd.length && !toRemove.length) {
    return
  }

  await Promise.all([
    ...toAdd.map(identifier => {
      return om.actions.develop.changeAppDevelopmentMode({
        banner,
        identifier,
        mode: 'development',
      })
    }),
    ...toRemove.map(identifier => {
      om.actions.develop.changeAppDevelopmentMode({ banner, identifier, mode: 'production' })
    }),
  ])

  // we have an update
  await om.actions.develop.loadApps()

  // load the proper development base bundle
  // await om.actions.develop.setBaseDllMode({ mode })

  // no re-run everything
  console.log('TODO make it run the bundle now')
  // om.actions.rerenderApp()

  // and print out the message
  // banner &&
  //   banner.set({
  //     type: 'success',
  //     message: `Success!`,
  //     timeout: 2,
  //   })
}

const changeAppDevelopmentMode: AsyncAction<{
  identifier: string
  mode: 'development' | 'production'
  banner?: BannerHandle | null
}> = async (om, { identifier, mode, banner }) => {
  const packageId = Desktop.state.workspaceState.identifierToPackageId[identifier]
  const name = stringToIdentifier(packageId)

  banner &&
    banner.set({
      type: 'info',
      message:
        mode === 'development'
          ? `Starting app ${identifier} in development...`
          : `Changing app ${identifier} to production...`,
      loading: true,
    })

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

  banner &&
    banner.set({
      type: 'success',
      loading: false,
      timeout: 1,
      message:
        mode === 'development' ? `Started app in development!` : `Switched back to production.`,
    })
}

function replaceScript(id: string, src: string) {
  const tag = document.getElementById(id)
  if (!tag) return null
  return new Promise(res => {
    tag.parentNode!.removeChild(tag)
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
  await replaceScript(`script_app_${name}`, `/${name}.${mode}.dll.js`)
}

const setBaseDllMode: AsyncAction<{ mode: DevMode }> = async (_, { mode }) => {
  await replaceScript('script_base', mode === 'development' ? '/baseDev.dll.js' : 'baseProd.dll.js')
}

export const loadApps: AsyncAction = async om => {
  // writing our own little System loader
  const nameRegistry = Desktop.state.workspaceState.nameRegistry
  om.state.develop.appModules = await Promise.all(
    nameRegistry.map(async ({ buildName, entryPathRelative }) => {
      const appModule = await loadSystemModule(buildName, window)
      return appModule(entryPathRelative)
    }),
  )
}

async function loadSystemModule(name: string, modules: any): Promise<(path: string) => any> {
  return new Promise(res => {
    const { args, init } = window['System'].registry[name]
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
  setBaseDllMode,
  loadAppDLL,
  loadApps,
}
