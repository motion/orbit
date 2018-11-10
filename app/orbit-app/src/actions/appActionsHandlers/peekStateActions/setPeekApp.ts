import { AppConfig } from '@mcro/stores'
import { peekPosition, Position } from '../../../helpers/peekPosition'
import { getTargetPosition } from '../../../helpers/getTargetPosition'
import invariant from 'invariant'
import { setAppState } from '../setAppState'
import { AppType } from '@mcro/models'

type PeekApp = {
  target: HTMLDivElement
  appConfig: AppConfig
  appType: AppType
  parentBounds?: Position
}

// using this ensures it clears old properties
// because App.setState merges not replaces
const DEFAULT_APP_CONFIG: AppConfig = {
  id: '',
  type: '',
  title: '',
  icon: '',
  subType: '',
  integration: '',
}

export const DEFAULT_VIEW_CONFIG: AppConfig['viewConfig']['initialState'] = {
  dimensions: null,
  initialState: null,
}

const getParentBounds = (target: HTMLDivElement) => {
  const node = target.closest('.app-parent-bounds') as HTMLDivElement
  if (!node) {
    console.error('No node to find parent bounds!')
    return null
  }
  return node.getBoundingClientRect()
}

export function setPeekApp({ target, appType, appConfig, parentBounds }: PeekApp) {
  invariant(appConfig, 'Must pass appConfig')
  setPeekState({
    target,
    appType,
    appConfig,
    parentBounds: parentBounds || getParentBounds(target),
  })
}

function setPeekState({ target, appConfig, appType, parentBounds }: PeekApp) {
  const realTarget = getTargetPosition(target)

  // TODO: we need a non-deep merge option for [Store].setState
  // because this pattern is too awkward and brittle
  // perhaps [Store].replaceState or [Store].setState(x, { replace: true })

  setAppState({
    appType,
    appConfig: {
      ...DEFAULT_APP_CONFIG,
      ...appConfig,
      viewConfig: {
        ...DEFAULT_VIEW_CONFIG,
        ...appConfig.viewConfig,
      },
    },
    target: realTarget,
    ...peekPosition(realTarget, appConfig, parentBounds || realTarget),
  })
}
