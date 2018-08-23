import { Person, Bit } from '@mcro/models'
import { App, AppStatePeekItem } from '@mcro/stores'
import { peekPosition } from '../../../helpers/peekPosition'
import { getTargetPosition } from '../../../helpers/getTargetPosition'
import invariant from 'invariant'
import { PeekTarget } from './types'
import { isEqual } from '@mcro/black'
import { logger } from '@mcro/logger'

const log = logger('selectItem')

export function setPeekState(props) {
  const target = getTargetPosition(props.target)
  App.setPeekState({
    ...props,
    target,
    ...peekPosition(target),
  })
}

export function toggleSelectItem(
  item: Person | Bit | AppStatePeekItem,
  target?: PeekTarget,
) {
  log('toggleSelectItem', item)
  if (isEqual(App.peekState.item, getItem(item))) {
    App.actions.clearPeek()
  } else {
    selectItem(item, target)
  }
}

export function selectItem(
  item?: Person | Bit | AppStatePeekItem,
  target?: PeekTarget,
) {
  invariant(item, 'Must pass item')
  setPeekState({
    target,
    peekId: Math.random(),
    item: getItem(item),
  })
}

function getItem(item: Person | Bit | AppStatePeekItem) {
  if (item.target === 'person') {
    invariant(item.name, 'Must pass Person name')
    return getPersonItem(item)
  } else if (item.target === 'bit') {
    invariant(item.title, 'Must pass Bit title')
    return getBitItem(item)
  } else {
    invariant(item.id, 'Must pass item id')
    return {
      id: item.id,
      title: item.title || '',
      icon: item.icon || '',
      type: item.type || '',
      // because were doing deep merging, we reset extra fields
      body: '',
      integration: item.integration || '',
      subType: item.subType || '',
    }
  }
}

function getPersonItem(person: Person) {
  return {
    id: person.id,
    icon: person.photo || '',
    title: person.name,
    body: '',
    type: 'person',
    integration: '',
    subType: '',
  }
}

function getBitItem(bit: Bit) {
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
