import { Bit, PersonBit, Setting } from '@mcro/models'
import { App, AppConfig } from '@mcro/stores'
import { peekPosition } from '../../../helpers/peekPosition'
import { getTargetPosition } from '../../../helpers/getTargetPosition'
import invariant from 'invariant'
import { PeekTarget } from './types'
import { logger } from '@mcro/logger'
import { personToAppConfig } from '../../../helpers/toAppConfig/personToAppConfig'
import { bitToAppConfig } from '../../../helpers/toAppConfig/bitToAppConfig'
import { setAppState } from '../setAppState'

export const log = logger('peekApp')

type PartialPeekState = { target: PeekTarget } & Partial<typeof App.peekState>

// using this ensures it clears old properties
// because App.setState merges not replaces
const DEFAULT_APP_CONFIG: AppConfig = {
  id: '',
  type: '',
  config: null,
  title: '',
  icon: '',
  subType: '',
  integration: '',
}

export function setPeekApp(
  item: PersonBit | Bit | Setting | AppConfig,
  target?: PeekTarget,
) {
  invariant(item, 'Must pass item')
  const appConfig = getAppConfig(item)
  setPeekState({
    target: target || App.peekState.target,
    peekId: Math.random(),
    appConfig: {
      ...DEFAULT_APP_CONFIG,
      ...appConfig,
    },
  })
}

function setPeekState({ target, appConfig, peekId }: PartialPeekState) {
  const realTarget = getTargetPosition(target)
  setAppState({
    peekId,
    appConfig: {
      ...DEFAULT_APP_CONFIG,
      ...appConfig,
    },
    target: realTarget,
    ...peekPosition(realTarget, appConfig),
  })
}

export function getAppConfig(
  item: PersonBit | Bit | Setting | AppConfig,
): AppConfig {
  if (!item['target']) {
    return item as AppConfig
  }
  switch (item['target']) {
    case 'person-bit':
      return personToAppConfig(item as PersonBit)
    case 'bit':
      return bitToAppConfig(item as Bit)
  }
}
