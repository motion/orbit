import { Bit, PersonBit } from '@mcro/models'
import { App, AppConfig } from '@mcro/stores'
import { peekPosition } from '../../../helpers/peekPosition'
import { getTargetPosition } from '../../../helpers/getTargetPosition'
import invariant from 'invariant'
import { PeekTarget } from './types'
import { logger } from '@mcro/logger'
import { personToAppConfig } from '../../../helpers/toAppConfig/personToAppConfig'
import { bitToAppConfig } from '../../../helpers/toAppConfig/bitToAppConfig'

export const log = logger('peekApp')

type PartialPeekState = { target: PeekTarget } & Partial<
  typeof App.state.peekState
>

export function setPeekApp(item: PersonBit | Bit, target?: PeekTarget) {
  invariant(item, 'Must pass item')
  const appConfig = getAppConfig(item)
  setPeekState({
    target: target || App.peekState.target,
    peekId: Math.random(),
    appConfig,
  })
}

function setPeekState({ target, appConfig, ...props }: PartialPeekState) {
  const realTarget = getTargetPosition(target)
  console.log('setting peek state', props)
  App.setPeekState({
    ...props,
    appConfig,
    target: realTarget,
    ...peekPosition(realTarget),
  })
}

export function getAppConfig(item: PersonBit | Bit | AppConfig): AppConfig {
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
