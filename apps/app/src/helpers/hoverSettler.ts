import { isEqual, throttle } from 'lodash'

// isEqual but works with dom nodes (lodash doesnt)
function isReallyEqual(a, b) {
  if (a && a.isEqualNode) {
    return a.isEqualNode(b)
  }
  return isEqual(a, b)
}

export function hoverSettler({
  enterDelay = 0,
  leaveDelay = 32,
  betweenDelay = 0,
  onHovered = null,
}) {
  let curOnHovered = onHovered
  let lastEnter
  let lastLeave
  let currentNode
  let lastHovered

  // debounce - leave space for ui thread
  const setHovered = throttle((nextHovered, cb) => {
    if (!isEqual(nextHovered, lastHovered)) {
      // 🐛 object spread fixes comparison bugs later on
      lastHovered = nextHovered ? { ...nextHovered } : nextHovered
      if (curOnHovered) {
        curOnHovered(nextHovered)
      }
      if (cb) {
        cb()
      }
    }
  }, 16)

  // these are if you want to also hook into, beyond the normal settler
  return ({ onHover = null, onBlur = null } = {}) => {
    let itemLastEnterTm
    let itemLastLeaveTm
    let fullyLeaveTm
    let betweenTm
    let itemProps
    let stickOnClick = false

    const select = target => {
      console.trace()
      console.log('target', target)
      let prevTarget = currentNode
      currentNode = target
      if (isReallyEqual(prevTarget, target)) {
        console.log('no target or is equal', currentNode, target)
        return
      }
      setHovered(
        target
          ? {
              top: target.offsetTop,
              left: target.offsetLeft,
              width: target.clientWidth,
              height: target.clientHeight,
              ...itemProps,
            }
          : null,
        onHover,
      )
      if (itemLastEnterTm === lastEnter) {
        itemLastEnterTm = null
        lastEnter = null
      }
    }

    function handleHover(target) {
      if (stickOnClick) {
        return
      }
      // remove any other enters/leaves
      clearTimeout(lastEnter)
      clearTimeout(lastLeave)
      clearTimeout(fullyLeaveTm)
      clearTimeout(betweenTm)
      // dont delay enter at all if were already hovering other node
      const isAlreadyHovering = !!currentNode
      if (isAlreadyHovering || enterDelay === 0) {
        if (betweenDelay) {
          betweenTm = setTimeout(() => select(target), betweenDelay)
        } else {
          select(target)
        }
      } else {
        itemLastEnterTm = lastEnter = setTimeout(
          () => select(target),
          enterDelay,
        )
      }
    }

    const onClick = throttle(e => {
      stickOnClick = true
      clearTimeout(lastEnter)
      clearTimeout(lastLeave)
      clearTimeout(fullyLeaveTm)
      clearTimeout(betweenTm)
      clearTimeout(itemLastLeaveTm)
      clearTimeout(itemLastEnterTm)
      if (!currentNode) {
        select(e.currentTarget)
      } else {
        select(null)
      }
    }, 100)

    function onMouseEnter(e) {
      clearTimeout(itemLastLeaveTm)
      const target = e.currentTarget
      handleHover(target)
    }

    function onMouseMove(e) {
      handleHover(e.currentTarget)
    }

    function onMouseLeave() {
      if (stickOnClick) {
        stickOnClick = false
        return
      }
      clearTimeout(itemLastLeaveTm)
      clearTimeout(fullyLeaveTm)
      clearTimeout(betweenTm)

      // be sure to clear your own hovers
      if (itemLastEnterTm === lastEnter) {
        clearTimeout(lastEnter)
      }
      lastLeave = itemLastLeaveTm = setTimeout(() => {
        if (!lastEnter) {
          setHovered(null, onBlur)
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
      setItem(props) {
        itemProps = props
        return this
      },
      setOnHovered(onHovered) {
        curOnHovered = onHovered
      },
      props: {
        onMouseEnter,
        onMouseLeave,
        onMouseMove,
        onClick,
      },
    }
  }
}
