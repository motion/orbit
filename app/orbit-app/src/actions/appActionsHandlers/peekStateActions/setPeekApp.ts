import { App, AppConfig } from '@mcro/stores'
import { peekPosition, Position } from '../../../helpers/peekPosition'
import { getTargetPosition } from '../../../helpers/getTargetPosition'
import invariant from 'invariant'
import { PeekTarget } from './types'
import { setAppState } from '../setAppState'

type PeekApp = {
  target: PeekTarget
  appConfig: AppConfig
  parentBounds: Position
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

const DEFAULT_APP_CONFIG_CONFIG: AppConfig['viewConfig']['initialState'] = {
  dimensions: null,
  initialState: null,
}

export function setPeekApp({ target, appConfig, parentBounds }: PeekApp) {
  invariant(appConfig, 'Must pass appConfig')
  setPeekState({
    target: target || App.peekState.target,
    appConfig,
    parentBounds,
  })
}

function setPeekState({ target, appConfig, parentBounds }: PeekApp) {
  const realTarget = getTargetPosition(target)
  setAppState({
    appConfig: {
      ...DEFAULT_APP_CONFIG,
      ...appConfig,
      viewConfig: {
        ...DEFAULT_APP_CONFIG_CONFIG,
        ...appConfig.viewConfig,
      },
    },
    target: realTarget,
    ...peekPosition(realTarget, appConfig, parentBounds),
  })
}
