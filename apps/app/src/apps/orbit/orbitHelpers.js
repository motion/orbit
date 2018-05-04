import { App } from '@mcro/all'
import peekPosition from '~/helpers/peekPosition'

export function setPeekTarget(bit, ref) {
  const target = getTargetPosition(ref)
  App.setPeekState({
    ...peekPosition(target),
    id: Math.random(),
    target,
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
