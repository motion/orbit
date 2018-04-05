import { isEqual, throttle } from 'lodash'

const log = debug('hoverSettler')

// isEqual but works with dom nodes (lodash doesnt)
function isReallyEqual(a, b) {
  if (a && a.isEqualNode) {
    return a.isEqualNode(b)
  }
  return isEqual(a, b)
}

export default function hoverSettler({ enterDelay, onHovered }) {
  let lastEnter
  let lastLeave
  let currentNode
  let lastHovered

  // debounce - leave space for ui thread
  const setHovered = throttle(nextHovered => {
    if (!isEqual(nextHovered, lastHovered)) {
      // 🐛 object spread fixes comparison bugs later on
      lastHovered = nextHovered ? { ...nextHovered } : nextHovered
      if (onHovered) {
        onHovered(nextHovered)
      }
    }
  }, 16)

  return extraProps => {
    let itemLastEnter
    let itemLastLeave

    function handleHover(target) {
      // remove any other enters/leaves
      clearTimeout(lastEnter)
      clearTimeout(lastLeave)

      const updateHover = () => {
        if (isReallyEqual(currentNode, target)) {
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
      if (isAlreadyHovering || enterDelay === 0) {
        updateHover()
      } else {
        itemLastEnter = lastEnter = setTimeout(updateHover, enterDelay)
      }
    }

    function onMouseEnter(e) {
      clearTimeout(itemLastLeave)
      const target = e.currentTarget
      handleHover(target)
    }

    function onMouseMove(e) {
      handleHover(e.currentTarget)
    }

    function onMouseLeave() {
      clearTimeout(itemLastLeave)
      // be sure to clear your own hovers
      if (itemLastEnter === lastEnter) {
        clearTimeout(lastEnter)
      }
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
