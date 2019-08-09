import { observeMany, removeHotHandler } from '@o/kit'
import { BuildStatus, BuildStatusModel } from '@o/models'
import { Desktop } from '@o/stores'
import { BannerHandle, stringToIdentifier } from '@o/ui'
import { difference } from 'lodash'
import { Action, AsyncAction } from 'overmind'

export type DevMode = 'development' | 'production'
export type DevelopState = {
  buildStatus: BuildStatus[]
}

export const state: DevelopState = {
  buildStatus: [],
}

const start: Action = om => {
  observeMany(BuildStatusModel).subscribe(status => {
    om.state.develop.buildStatus = status
  })
}

const updateDeveloping: AsyncAction<{ identifiers: string[]; banner?: BannerHandle }> = async (
  om,
  { identifiers, banner },
) => {
  const developingIdentifiers = om.state.develop.buildStatus
    .filter(x => x.mode === 'development')
    .map(x => x.identifier)
  const mode: DevMode = !!developingIdentifiers.length ? 'development' : 'production'

  // load new app scripts
  const addIdentifiers = difference(identifiers, developingIdentifiers)
  const removeIentifiers = difference(developingIdentifiers, identifiers)
  await Promise.all([
    ...addIdentifiers.map(identifier => {
      return om.actions.develop.changeAppDevelopmentMode({
        banner,
        identifier,
        mode: 'development',
      })
    }),
    ...removeIentifiers.map(identifier => {
      om.actions.develop.changeAppDevelopmentMode({ banner, identifier, mode: 'production' })
    }),
  ])

  // load the proper development base bundle
  await om.actions.develop.setBaseDllMode({ mode })

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
  banner?: BannerHandle
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
  removeHotHandler(`app_${name}`)

  // load the new script
  await om.actions.develop.loadAppDLL({ name, mode })

  banner &&
    banner.set({
      type: 'success',
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

export const actions = {
  start,
  updateDeveloping,
  changeAppDevelopmentMode,
  setBaseDllMode,
  loadAppDLL,
}
