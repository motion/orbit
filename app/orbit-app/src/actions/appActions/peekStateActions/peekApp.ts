import { Bit, PersonBit } from '@mcro/models'
import { App, AppConfig } from '@mcro/stores'
import { peekPosition } from '../../../helpers/peekPosition'
import { getTargetPosition } from '../../../helpers/getTargetPosition'
import invariant from 'invariant'
import { PeekTarget } from './types'
import { logger } from '@mcro/logger'

export const log = logger('peekApp')

type PartialPeekState = { target: PeekTarget } & Partial<
  typeof App.state.peekState
>

export function setPeekState({ target, ...props }: PartialPeekState) {
  const realTarget = getTargetPosition(target)
  console.log('setting peek state', props)
  App.setPeekState({
    ...props,
    target: realTarget,
    ...peekPosition(realTarget),
  })
}

export function setPeekApp(item: PersonBit | Bit, target?: PeekTarget) {
  invariant(item, 'Must pass item')
  setPeekState({
    target: target || App.peekState.target,
    peekId: Math.random(),
    appConfig: getAppConfig(item),
  })
}

export function getAppConfig(item: PersonBit | Bit | AppConfig): AppConfig {
  if (!item['target']) {
    return item as AppConfig
  }
  switch (item['target']) {
    case 'person-bit':
      return getPersonItem(item as PersonBit)
    case 'bit':
      return getBitItem(item as Bit)
  }
}

function getPersonItem(person: PersonBit): AppConfig {
  return {
    id: person.email,
    icon: person.photo || '',
    title: person.name,
    body: '',
    type: 'person',
    integration: '',
    subType: '',
    config: {
      showTitleBar: false,
    },
  }
}

function getBitItem(bit: Bit): AppConfig {
  return {
    id: bit.id,
    icon: bit.integration || '',
    title: bit.title,
    body: bit.body || '',
    type: 'bit',
    subType: bit.type,
    integration: bit.integration || '',
  }
}
