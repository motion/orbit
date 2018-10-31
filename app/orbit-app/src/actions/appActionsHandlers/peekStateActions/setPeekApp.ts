import { App, AppConfig } from '@mcro/stores'
import { peekPosition } from '../../../helpers/peekPosition'
import { getTargetPosition } from '../../../helpers/getTargetPosition'
import invariant from 'invariant'
import { PeekTarget } from './types'
import { setAppState } from '../setAppState'

type PartialPeekState = { target: PeekTarget } & Partial<typeof App.peekState>

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

export function setPeekApp(appConfig: AppConfig, target?: PeekTarget) {
  invariant(appConfig, 'Must pass appConfig')
  setPeekState({
    target: target || App.peekState.target,
    appConfig,
  })
}

function setPeekState({ target, appConfig }: PartialPeekState) {
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
    ...peekPosition(realTarget, appConfig),
  })
}
