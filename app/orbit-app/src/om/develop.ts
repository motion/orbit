import { removeHotHandler } from '@o/kit'
import { Desktop } from '@o/stores'
import { BannerHandle, stringToIdentifier } from '@o/ui'
import { difference } from 'lodash'
import { Action, AsyncAction, Derive } from 'overmind'

type DevMode = 'development' | 'production'
type DevelopState = {
  developingIdentifiers: string[]
  mode: Derive<DevelopState, DevMode>
}

export const state: DevelopState = {
  developingIdentifiers: [],
  // if any apps in dev mode, we move everything into dev mode
  mode: ({ developingIdentifiers }) =>
    !!developingIdentifiers.length ? 'development' : 'production',
}

const start: Action = om => {
  om.state.develop.developingIdentifiers = Desktop.state.workspaceState.developingAppIdentifiers
}

const updateDeveloping: Action<{ identifiers: string[]; banner?: BannerHandle }> = (
  om,
  { identifiers, banner },
) => {
  const { developingIdentifiers } = om.state.develop
  const addIdentifiers = difference(identifiers, developingIdentifiers)
  addIdentifiers.forEach(identifier => {
    om.actions.develop.changeAppDevelopmentMode({ banner, identifier, mode: 'development' })
  })
  const removeIentifiers = difference(developingIdentifiers, identifiers)
  removeIentifiers.forEach(identifier => {
    om.actions.develop.changeAppDevelopmentMode({ banner, identifier, mode: 'production' })
  })
  om.state.develop.developingIdentifiers = identifiers
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
    let tries = 0
    let tm = setInterval(() => {
      tries++
      if (tries > 50) {
        const errorMessage = 'Tried 50 times, no success loading production bundle...'
        if (banner) {
          banner.set({
            type: 'error',
            message: errorMessage,
          })
        } else {
          console.error(errorMessage)
        }
        clearInterval(tm)
      }
      fetch(`/${name}.${mode}.dll.js`)
        .then(() => {
          clearInterval(tm)
          res()
        })
        .catch(() => {
          // not loaded yet
          console.log('ok')
        })
    }, 150)
  })

  // close old hot event listener
  removeHotHandler(`app_${name}`)
  // load the new script
  om.actions.develop.loadAppDLL({ name, mode })
  // trigger the script to run
  console.log('TODO make it run the bundle now')
  om.actions.rerenderApp()

  banner &&
    banner.set({
      type: 'success',
      message: `Success!`,
      timeout: 2,
    })
}

function replaceScript(id: string, src: string) {
  const tag = document.getElementById(id)
  if (!tag) return
  tag.parentNode!.removeChild(tag)
  const body = document.getElementsByTagName('body')[0]
  const script = document.createElement('script')
  script.id = id
  script.src = src
  script.type = 'text/javascript'
  body.appendChild(script)
}

const loadAppDLL: Action<{ name: string; mode: DevMode }> = (_, { name, mode }) => {
  replaceScript(`script_app_${name}`, `/${name}.${mode}.dll.js`)
}

const setBaseDllMode: Action<{ mode: DevMode }> = (_, { mode }) => {
  replaceScript('script_base', mode === 'development' ? '/baseDev.dll.js' : 'baseProd.dll.js')
}

export const actions = {
  start,
  updateDeveloping,
  changeAppDevelopmentMode,
  setBaseDllMode,
  loadAppDLL,
}
