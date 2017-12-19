import { isEqual } from 'lodash'

export default function hoverSettler({ enterDelay, onHovered }) {
  let lastEnter
  let lastLeave
  let currentNode
  let lastHover

  const setHovered = object => {
    lastHover = object
    if (onHovered) {
      onHovered(object)
    }
  }

  return extraProps => {
    let itemLastEnter
    let itemLastLeave

    function handleHover(target) {
      clearTimeout(lastEnter)
      clearTimeout(lastLeave)
      // dont delay at all if were already hovering
      const isAlreadyHovering = !!currentNode
      const delay = isAlreadyHovering ? 0 : enterDelay
      itemLastEnter = lastEnter = setTimeout(() => {
        currentNode = target
        if (!target) {
          return
        }
        const nextHover = {
          top: target.offsetTop,
          left: target.offsetLeft,
          width: target.clientWidth,
          height: target.clientHeight,
          ...extraProps,
        }
        if (!isEqual(nextHover, lastHover)) {
          setHovered(nextHover)
        }
      }, delay)
    }

    function onMouseEnter(e) {
      handleHover(e.currentTarget)
    }

    function onMouseMove(e) {
      handleHover(e.currentTarget)
    }

    function onMouseLeave() {
      clearTimeout(lastEnter)
      clearTimeout(itemLastLeave)
      itemLastLeave = setTimeout(() => {
        if (itemLastEnter === lastEnter) {
          setHovered(null)
          itemLastEnter = null
          currentNode = null
        }
      }, 50)
    }

    return {
      onMouseEnter,
      onMouseLeave,
      onMouseMove,
    }
  }
}
