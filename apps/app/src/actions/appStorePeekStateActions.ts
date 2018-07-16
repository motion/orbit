import { Person, Bit } from '@mcro/models'
import { App, AppStatePeekItem } from '@mcro/stores'
import peekPosition from '../helpers/peekPosition'
import invariant from 'invariant'
import debug from '@mcro/debug'

const log = debug('appStorePeekStateActions')

type PositionObject =
  | HTMLElement
  | {
      top: number
      left: number
      width: number
      height: number
    }

function setPeekState(props) {
  const target = getTargetPosition(props.target)
  App.setPeekState({
    ...props,
    target,
    ...peekPosition(target),
  })
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
      },
    })
  }
}

export function selectPerson(person: Person, target?: PositionObject) {
  const avatar = person.data.profile.image_48
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
    },
  })
}

export function selectBit(bit: Bit, target?: PositionObject) {
  setPeekState({
    target,
    peekId: Math.random(),
    item: {
      id: bit.id,
      icon: bit.icon || '',
      title: bit.title,
      body: bit.body || '',
      type: bit.type || '',
      integration: bit.integration || '',
    },
  })
}

function getTargetPosition(node: PositionObject) {
  if (!node) {
    return null
  }
  if (node instanceof HTMLElement) {
    const { top, left, height } = node.getBoundingClientRect()
    return {
      top,
      left: left,
      width: App.orbitState.size[0],
      height,
    }
  }
  return node
}

export function clearPeek() {
  if (App.peekState.devModeStick) {
    console.log('Peek pinned, ignore')
    return
  }
  setPeekState({
    peekId: null,
    target: null,
    item: null,
    pinned: false,
  })
}

export function toggleDevModeStick() {
  App.setPeekState({
    devModeStick: !App.peekState.devModeStick,
  })
}

export function finishPeekDrag(position) {
  App.setPeekState({
    pinned: true,
    position,
  })
}
