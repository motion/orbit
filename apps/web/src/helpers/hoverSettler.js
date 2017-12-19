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
      // remove any other enters/leaves
      clearTimeout(lastEnter)
      clearTimeout(lastLeave)

      const updateHover = () => {
        if (currentNode && currentNode.isEqualNode(target)) {
          return
        }
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
      }

      // dont delay enter at all if were already hovering other node
      const isAlreadyHovering = !!currentNode
      if (isAlreadyHovering) {
        updateHover()
      } else {
        itemLastEnter = lastEnter = setTimeout(updateHover, enterDelay)
      }
    }

    function onMouseEnter(e) {
      handleHover(e.currentTarget)
    }

    function onMouseMove(e) {
      handleHover(e.currentTarget)
    }

    function onMouseLeave() {
      clearTimeout(itemLastLeave)
      lastLeave = itemLastLeave = setTimeout(() => {
        if (!lastEnter) {
          setHovered(null)
          itemLastEnter = null
          currentNode = null
        }
      }, 32)
    }

    return {
      onMouseEnter,
      onMouseLeave,
      onMouseMove,
    }
  }
}
