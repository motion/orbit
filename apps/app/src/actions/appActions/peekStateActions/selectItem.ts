import { Person, Bit } from '@mcro/models'
import { App, AppStatePeekItem } from '@mcro/stores'
import { peekPosition } from '../../../helpers/peekPosition'
import { getTargetPosition } from '../../../helpers/getTargetPosition'
import invariant from 'invariant'

type PositionObject =
  | HTMLElement
  | {
      top: number
      left: number
      width: number
      height: number
    }

export function setPeekState(props) {
  const target = getTargetPosition(props.target)
  App.setPeekState({
    ...props,
    target,
    ...peekPosition(target),
  })
}

const oneWayEqual = (a, b) =>
  a && b && Object.keys(a).reduce((res, key) => a[key] === b[key] && res, true)

export function toggleSelectItem(
  item: Person | Bit | AppStatePeekItem,
  target?: PositionObject,
) {
  if (oneWayEqual(item, App.peekState.item)) {
    App.actions.clearPeek()
  } else {
    selectItem(item, target)
  }
}

export function selectItem(
  item: Person | Bit | AppStatePeekItem,
  target?: PositionObject,
) {
  invariant(item, 'Must pass item')
  if (item instanceof Person) {
    invariant(item.name, 'Must pass Person name')
    selectPerson(item, target)
  } else if (item instanceof Bit) {
    invariant(item.title, 'Must pass Bit title')
    selectBit(item, target)
  } else {
    invariant(item.title, 'Must pass item title')
    invariant(item.type, 'Must pass item type')
    invariant(item.id, 'Must pass item id')
    setPeekState({
      target,
      peekId: Math.random(),
      item: {
        id: item.id,
        title: item.title,
        icon: item.icon || '',
        type: item.type || '',
        // because were doing deep merging, we reset extra fields
        body: '',
        integration: item.integration || '',
        subType: item.subType || '',
      },
    })
  }
}

function selectPerson(person: Person, target?: PositionObject) {
  const avatar = person.data.profile ? person.data.profile.image_48 : ''
  setPeekState({
    target,
    peekId: Math.random(),
    item: {
      id: person.id,
      icon: avatar,
      title: person.name,
      body: '',
      type: 'person',
      integration: '',
      subType: '',
    },
  })
}

function selectBit(bit: Bit, target?: PositionObject) {
  setPeekState({
    target,
    peekId: Math.random(),
    item: {
      id: bit.id,
      icon: bit.icon || '',
      title: bit.title,
      body: bit.body || '',
      type: 'bit',
      subType: bit.type,
      integration: bit.integration || '',
    },
  })
}
