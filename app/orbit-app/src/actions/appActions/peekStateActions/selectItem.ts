import { Bit, PersonBit } from '@mcro/models'
import { App, AppStatePeekItem } from '@mcro/stores'
import { peekPosition } from '../../../helpers/peekPosition'
import { getTargetPosition } from '../../../helpers/getTargetPosition'
import invariant from 'invariant'
import { PeekTarget } from './types'
import { isEqual } from '@mcro/black'
import { logger } from '@mcro/logger'
import { ResolvedItem } from '../../../components/ItemResolver'

const log = logger('selectItem')

export function setPeekState(props) {
  const target = getTargetPosition(props.target)
  App.setPeekState({
    ...props,
    target,
    ...peekPosition(target),
  })
}

export function toggleSelectItem(item: PersonBit | Bit, target?: PeekTarget) {
  log('toggleSelectItem', item)
  if (isEqual(App.peekState.item, getItem(item))) {
    App.actions.clearPeek()
  } else {
    selectItem(item, target)
  }
}

export function selectItem(item?: PersonBit | Bit, target?: PeekTarget) {
  invariant(item, 'Must pass item')
  setPeekState({
    target,
    peekId: Math.random(),
    item: getItem(item),
  })
}

function getItem(item: PersonBit | Bit): AppStatePeekItem {
  switch (item.target) {
    case 'person-bit':
      return getPersonItem(item as PersonBit)
    case 'bit':
      return getBitItem(item as Bit)
  }
}

function getPersonItem(person: PersonBit): AppStatePeekItem {
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

function getBitItem(bit: Bit): AppStatePeekItem {
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
