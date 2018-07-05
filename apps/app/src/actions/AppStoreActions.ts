import { Person, Bit } from '@mcro/models'
import { App } from '@mcro/stores'
import peekPosition from '../helpers/peekPosition'

type PositionObject =
  | HTMLElement
  | {
      top: number
      left: number
      width: number
      height: number
    }

type GenericPeekItem = {
  id: string
  type: string
  title?: string
  integration?: string
}

export function selectItem(
  item: Person | Bit | GenericPeekItem,
  target?: PositionObject,
) {
  console.log('selecting', item.toJS())
  if (item instanceof Person) {
    selectPerson(item, target)
  } else if (item instanceof Bit) {
    selectBit(item, target)
  } else {
    App.setPeekState({
      ...withPosition(target),
      bit: {
        id: item.id,
        title: item.title,
        type: item.type,
        // because were doing deep merging, we reset extra fields
        body: '',
        integration: item.integration || '',
        icon: '',
      },
    })
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
    item: null,
  })
}
