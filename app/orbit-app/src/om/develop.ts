import { removeHotHandler } from '@o/kit'
import { Desktop } from '@o/stores'
import { stringToIdentifier } from '@o/ui'
import { AsyncAction } from 'overmind'

const changeAppDevelopmentMode: AsyncAction<{
  identifier: string
  mode: 'development' | 'production'
}> = async (om, { identifier, mode }) => {
  const packageId = Desktop.state.workspaceState.identifierToPackageId[identifier]
  const name = stringToIdentifier(packageId)
  // close old hot event listener
  removeHotHandler(`app_${name}`)
  // load the new script
  loadAppDLL(name, mode)
  // trigger the script to run
  console.log('TODO make it run the bundle now')
  om.actions.rerenderApp()
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
  status: 'idle',
}

export const actions = {
  changeAppDevelopmentMode,
}
