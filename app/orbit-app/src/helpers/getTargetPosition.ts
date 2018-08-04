import { App } from '@mcro/stores'

type Position = {
  top: number
  left: number
  width: number
  height: number
}

export function getTargetPosition(node: HTMLElement | Position): Position {
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
  return {
    top: node.top,
    left: node.left,
    width: node.width,
    height: node.height,
  }
}
