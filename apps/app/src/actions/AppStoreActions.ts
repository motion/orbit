import { Person, Bit } from '@mcro/models'
import { App } from '@mcro/stores'
import peekPosition from '../helpers/peekPosition'
import invariant from 'invariant'

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

function setPeekState(props, target?) {
  App.setPeekState({
    target,
    ...getPosition(target),
    ...props,
  })
}

export function selectItem(
  item: Person | Bit | GenericPeekItem,
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
    setPeekState(
      {
        peekId: Math.random(),
        item: {
          id: item.id,
          title: item.title,
          type: item.type || '',
          // because were doing deep merging, we reset extra fields
          body: '',
          integration: item.integration || '',
          icon: '',
        },
      },
      target,
    )
  }
}

export function selectPerson(person: Person, target?: PositionObject) {
  const avatar = person.data.profile.image_48
  setPeekState(
    {
      peekId: Math.random(),
      item: {
        id: person.id,
        icon: avatar,
        title: person.name,
        body: '',
        type: 'person',
        integration: '',
      },
    },
    target,
  )
}

export function selectBit(bit: Bit, target?: PositionObject) {
  setPeekState(
    {
      peekId: Math.random(),
      item: {
        id: bit.id,
        icon: bit.icon,
        title: bit.title,
        body: bit.body,
        type: bit.type,
        integration: bit.integration,
      },
    },
    target,
  )
}

function getPosition(node?: PositionObject) {
  if (!node) {
    return null
  }
  const target = getTargetPosition(node)
  return peekPosition(target)
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
