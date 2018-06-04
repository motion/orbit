import { Person, Bit } from '@mcro/models'
import { App } from '@mcro/all'
import peekPosition from '../helpers/peekPosition'

export function selectItem(item: Person | Bit, ref?: any) {
  if (item instanceof Person) {
    selectPerson(item, ref)
  } else {
    selectBit(item, ref)
  }
}

export function selectPerson(person: Person, ref) {
  const avatar = person.data.profile.image_48
  App.setPeekState({
    ...withPosition(ref),
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

export function selectBit(bit, ref) {
  App.setPeekState({
    ...withPosition(ref),
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

function withPosition(ref) {
  if (!ref) {
    return null
  }
  const target = getTargetPosition(ref)
  return {
    ...peekPosition(target),
    target,
  }
}

function getTargetPosition(ref) {
  if (!ref) {
    throw `no result ref ${ref}`
  }
  const { top, left, height } = ref.getBoundingClientRect()
  return {
    top,
    left: left,
    width: App.orbitState.size[0],
    height,
  }
}
