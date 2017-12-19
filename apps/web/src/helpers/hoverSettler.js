import { isEqual } from 'lodash'
import debug from 'debug'

const log = debug('hoverSettler')

export default function hoverSettler({ enterDelay, onHovered }) {
  let lastEnter
  let lastLeave
  let currentNode
  let lastHovered

  const setHovered = nextHovered => {
    if (!isEqual(nextHovered, lastHovered)) {
      // 🐛 object spread fixes comparison bugs later on
      lastHovered = { ...nextHovered }
      log('setHovered', nextHovered)
      if (onHovered) {
        onHovered(nextHovered)
      }
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
        setHovered({
          top: target.offsetTop,
          left: target.offsetLeft,
          width: target.clientWidth,
          height: target.clientHeight,
          ...extraProps,
        })
        if (itemLastEnter === lastEnter) {
          itemLastEnter = null
          lastEnter = null
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
        if (!lastEnter) {
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
