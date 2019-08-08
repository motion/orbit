import { removeHotHandler } from '@o/kit'
import { Desktop } from '@o/stores'
import { BannerHandle, stringToIdentifier } from '@o/ui'
import { difference } from 'lodash'
import { Action, AsyncAction } from 'overmind'

const start: Action = () => {
  // nada
}

const updateDeveloping: Action<{ identifiers: string[]; banner?: BannerHandle }> = (
  om,
  { identifiers, banner },
) => {
  const lastDeveloping = om.state.develop.lastDeveloping
  const addIdentifiers = difference(identifiers, lastDeveloping)
  addIdentifiers.forEach(identifier => {
    om.actions.develop.changeAppDevelopmentMode({ banner, identifier, mode: 'development' })
  })
  const removeIentifiers = difference(lastDeveloping, identifiers)
  removeIentifiers.forEach(identifier => {
    om.actions.develop.changeAppDevelopmentMode({ banner, identifier, mode: 'production' })
  })
  om.state.develop.lastDeveloping = identifiers
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
  loadAppDLL(name, mode)
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

function loadAppDLL(name: string, mode: 'development' | 'production') {
  const id = `app_script_${name}`
  const tag = document.getElementById(id)
  if (!tag) return
  tag.parentNode!.removeChild(tag)
  const body = document.getElementsByTagName('body')[0]
  const script = document.createElement('script')
  script.id = id
  script.src = `/${name}.${mode}.dll.js`
  script.type = 'text/javascript'
  body.appendChild(script)
}

export const state = {
  // TODO add some status messages
  lastDeveloping: [] as string[],
}

export const actions = {
  start,
  updateDeveloping,
  changeAppDevelopmentMode,
}
