import { isEqual, throttle } from 'lodash'

const log = debug('hoverSettler')

// isEqual but works with dom nodes (lodash doesnt)
function isReallyEqual(a, b) {
  if (a && a.isEqualNode) {
    return a.isEqualNode(b)
  }
  return isEqual(a, b)
}

export default function hoverSettler({
  enterDelay = 0,
  leaveDelay = 32,
  betweenDelay = 0,
  onHovered,
}) {
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
    let itemLastEnterTm
    let itemLastLeaveTm
    let fullyLeaveTm
    let betweenTm

    function handleHover(target) {
      // remove any other enters/leaves
      clearTimeout(lastEnter)
      clearTimeout(lastLeave)
      clearTimeout(fullyLeaveTm)
      clearTimeout(betweenTm)

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
        if (itemLastEnterTm === lastEnter) {
          itemLastEnterTm = null
          lastEnter = null
        }
      }

      // dont delay enter at all if were already hovering other node
      const isAlreadyHovering = !!currentNode
      if (isAlreadyHovering || enterDelay === 0) {
        if (betweenDelay) {
          betweenTm = setTimeout(updateHover, betweenDelay)
        } else {
          updateHover()
        }
      } else {
        itemLastEnterTm = lastEnter = setTimeout(updateHover, enterDelay)
      }
    }

    function onMouseEnter(e) {
      clearTimeout(itemLastLeaveTm)

      const target = e.currentTarget
      handleHover(target)
    }

    function onMouseMove(e) {
      handleHover(e.currentTarget)
    }

    function onMouseLeave() {
      clearTimeout(itemLastLeaveTm)
      clearTimeout(fullyLeaveTm)
      clearTimeout(betweenTm)

      // be sure to clear your own hovers
      if (itemLastEnterTm === lastEnter) {
        clearTimeout(lastEnter)
      }
      lastLeave = itemLastLeaveTm = setTimeout(() => {
        if (!lastEnter) {
          setHovered(null)
          itemLastEnterTm = null
        }
      }, leaveDelay)
      // clear this after enter delay finish
      // lets your mouse leave the target and re-enter
      // and as long as it re-enters before enterDelay time,
      // you won't get an extra lag time
      fullyLeaveTm = setTimeout(() => {
        currentNode = null
      }, Math.min(leaveDelay, enterDelay))
    }

    return {
      onMouseEnter,
      onMouseLeave,
      onMouseMove,
    }
  }
}
