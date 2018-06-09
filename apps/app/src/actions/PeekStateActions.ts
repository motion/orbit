import { Person, Bit } from '@mcro/models'
import { App } from '@mcro/all'
import peekPosition from '../helpers/peekPosition'

type PositionObject =
  | HTMLElement
  | {
      top: number
      left: number
      width: number
      height: number
    }

export function selectItem(item: Person | Bit, target?: PositionObject) {
  if (item instanceof Person) {
    selectPerson(item, target)
  } else {
    selectBit(item, target)
  }
}

export function selectPerson(person: Person, target?: PositionObject) {
  const avatar = person.data.profile.image_48
  App.setPeekState({
    ...withPosition(target),
    id: person.id,
    bit: {
      id: person.id,
      icon: avatar,
      title: person.name,
      body: '',
      type: 'person',
      integration: '',
    },
  })
}

export function selectBit(bit: Bit, node?: PositionObject) {
  App.setPeekState({
    ...withPosition(node),
    id: Math.random(),
    bit: {
      id: bit.id,
      icon: bit.icon,
      title: bit.title,
      body: bit.body,
      type: bit.type,
      integration: bit.integration,
    },
  })
}

function withPosition(node?: PositionObject) {
  if (!node) {
    return null
  }
  const target = getTargetPosition(node)
  return {
    ...peekPosition(target),
    target,
  }
}

function getTargetPosition(node: PositionObject) {
  if (!node) {
    throw `no result node ${node}`
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
  if (App.peekState.pinned) {
    console.log('Peek pinned, ignore')
    return
  }
  App.setPeekState({
    id: null,
    target: null,
  })
}