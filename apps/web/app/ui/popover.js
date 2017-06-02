// TODO https://github.com/tristen/hoverintent
import React from 'react'
import { object, string } from 'prop-types'
import { view, getTarget } from '~/helpers'
import Portal from 'react-portal'
import { isNumber, debounce } from 'lodash'

const INVERSE = {
  top: 'bottom',
  bottom: 'top',
  left: 'right',
  right: 'bottom',
}

const DARK_BG = [0, 0, 0, 0.75]

const maxForgiveness = (forgiveness, distance) =>
  Math.min(forgiveness, distance)

@view.ui class Arrow {
  getRotation = () => {
    const { towards } = this.props
    switch (towards) {
      case 'left':
        return '-45deg'
      case 'right':
        return '-90deg'
    }
    return '0deg'
  }

  render({ size, towards, theme }) {
    const onBottom = towards === 'bottom'
    const innerTop = size * (onBottom ? -1 : 1)

    return (
      <arrow $rotate={this.getRotation()} style={{ width: size, height: size }}>
        <arrowInner
          style={{
            top: innerTop * 0.75,
            width: size,
            height: size,
          }}
        />
      </arrow>
    )
  }

  static style = {
    arrow: {
      position: 'relative',
      overflow: 'hidden',
    },
    arrowInner: {
      background: '#fff',
      position: 'absolute',
      left: 0,
      borderRadius: 1,
      transform: 'rotate(45deg)',
    },
    rotate: amount => ({
      transform: {
        rotate: amount,
      },
    }),
  }

  static theme = {
    theme: (props, state, activeTheme) => ({
      arrowInner: activeTheme.base,
    }),
  }
}

@view.ui
export default class Popover {
  props: {
    target?: Function | string | Object,
    open?: boolean,
    // the amount of space around popover you can move mouse
    // before it triggers it to close
    forgiveness: number,
    // show a background over content
    overlay?: boolean,
    left?: number,
    top?: number,
    // the distance the popover is from the target
    // so it displays nicely spaced away
    distance: number,
    // will open when target is clicked
    openOnClick?: boolean,
    // will open automatically when target is hovered
    openOnHover?: boolean,
    // prevents popover itself from catching pointer events
    noHover?: boolean,
    // will exit with `esc` key
    escapable?: boolean,
    // size of shown arrow
    arrowSize?: number,
    closeOnClickWithin?: boolean,
    // which direction it shows towards
    // default will determine direction automatically
    towards: 'auto' | 'left' | 'right' | 'bottom' | 'top',
    padding?: Array | number,
    onMouseEnter?: Function,
    onMouseLeave?: Function,
    onClose?: Function,
    animation?: string,
    // lets you adjust position after target is positioned
    adjust?: Array,
    // hide arrow
    noArrow?: boolean,
    // DEBUG: helps you see forgiveness zone
    showForgiveness?: boolean,
  }

  static defaultProps = {
    distance: 10,
    arrowSize: 11,
    forgiveness: 15,
    towards: 'auto',
    animation: 'slide 200ms',
    adjust: [0, 0],
  }

  static contextTypes = {
    uiTheme: object,
    uiActiveTheme: string,
  }

  state = {
    targetHovered: null,
    menuHovered: false,
    top: 0,
    left: 0,
    bottom: 0,
    arrowTop: 0,
    arrowLeft: 0,
    arrowInnerTop: 0,
    isOpen: false,
    direction: null,
  }

  componentDidMount() {
    const { openOnClick, open, escapable } = this.props

    this.on(window, 'resize', debounce(() => this.setPosition(this.props), 64))

    this.setTarget()
    this.listenForHover()

    if (openOnClick) {
      this.listenForClick()
      this.listenForClickAway()
    }
    if (open) {
      this.open(this.props)
    }

    if (escapable) {
      this.on(window, 'keydown', e => {
        if (e.keyCode === 27 && (open || this.state.open)) {
          this.close()
        }
      })
    }
  }

  componentWillUnmount() {
    this.unmounted = true
  }

  componentWillUpdate(nextProps, nextState) {
    this.setTarget()
    this.setOpenOrClosed(nextProps)
  }

  componentWillReceiveProps(nextProps) {
    this.setPosition(nextProps)
  }

  open = props => {
    this.setPosition(props, () => {
      this.setState({ isOpen: true }, () => {
        if (this.props.onOpen) {
          this.props.onOpen()
        }
      })
    })
  }

  close = (): Promise => {
    return new Promise(resolve => {
      this.setState({ closing: true }, () => {
        if (this.props.onClose) {
          this.props.onClose()
        }

        this.closingTimeout = this.setTimeout(() => {
          this.setState({ closing: false, isOpen: false })
          resolve()
        }, 300)
      })
    })
  }

  listenForClick = () => {
    if (!this.target) return

    // click away to close
    this.on(this.target, 'click', e => {
      e.stopPropagation()
      this.isClickingTarget = true
      if (typeof this.props.open === 'undefined') {
        if (this.state.isOpen) this.close()
        else this.open(this.props)
      }
      this.setTimeout(() => {
        this.isClickingTarget = false
      })
    })
  }

  listenForClickAway = () => {
    // click away to close
    this.on(window, 'click', e => {
      // avoid closing when clicked inside popover
      if (
        this.refs.popover.contains(e.target) &&
        !this.props.closeOnClickWithin
      ) {
        return
      }

      if (this.state.isOpen && !this.isClickingTarget) {
        e.preventDefault()
        this.close()
      }
    })
  }

  setTarget = () => {
    this.target = getTarget(this.refs.target || this.props.target)
  }

  isHovered = () => {
    const target = this.target
    if (!target) {
      return false
    }
    const { noHover, targetHovered, menuHovered } = this.state
    if (noHover) {
      return targetHovered
    }
    return targetHovered || menuHovered
  }

  // transitions between open and closed
  setOpenOrClosed = nextProps => {
    if (nextProps.open === this.props.open) {
      return
    }

    if (nextProps.open !== this.props.open) {
      if (nextProps.open) {
        this.setPosition(nextProps)
      }

      if (!this.state.isOpen && nextProps.open) {
        this.open(nextProps)
      }

      if (this.state.isOpen && !nextProps.open) {
        this.close()
      }
    }
  }

  setPosition = (props, cb) => {
    clearTimeout(this.positionTimeout)
    this.positionTimeout = this.setTimeout(() => {
      if (!this.unmounted) {
        this.setState(this.getPositionState(props), cb)
      }
    })
  }

  getPopoverSize = ({ width, height, distance, forgiveness }): Object => {
    const { popover } = this.refs
    const size = {
      height: isNumber(width) ? width : popover.clientHeight,
      width: isNumber(height) ? height : popover.clientWidth,
    }
    // adjust for forgiveness
    const maxForgive = maxForgiveness(forgiveness, distance)
    size.height -= maxForgive * 2
    size.width -= maxForgive * 2
    return size
  }

  getTargetBounds = (props): Object => {
    const { top, left } = props
    const bounds = {}
    // find target dimensions
    if (this.isManuallyPositioned(props)) {
      bounds.width = 0
      bounds.height = 0
      bounds.left = left
      bounds.top = top
    } else {
      const targetBounds = this.target.getBoundingClientRect()
      bounds.width = targetBounds.width
      bounds.height = targetBounds.height
      bounds.left = targetBounds.left
      bounds.top = targetBounds.top
    }
    return bounds
  }

  isManuallyPositioned = ({ bottom, top, left }) => {
    return (isNumber(bottom) || isNumber(top)) && isNumber(left)
  }

  getPositionState = props => {
    if (!this.target && !this.isManuallyPositioned(props)) {
      throw new Error('No top/left/bottom or target given to Popover!')
    }

    const popoverSize = this.getPopoverSize(props)
    const targetBounds = this.getTargetBounds(props)
    // direction is final direction accounting for towards="auto"
    const direction = this.getDirection(props, targetBounds, popoverSize)

    return {
      ...this.getX(props, direction, popoverSize, targetBounds),
      ...this.getY(props, direction, popoverSize, targetBounds),
      direction,
    }
  }

  getDirection = ({ forgiveness, towards }, targetBounds, popoverSize) => {
    if (towards !== 'auto') {
      return towards
    }
    const popoverY = popoverSize.height + forgiveness
    const targetY = targetBounds.top + targetBounds.height
    const towardsTop = targetY + popoverY > window.innerHeight
    console.log('towardsTop = ', targetY + popoverY, window.innerHeight)
    return towardsTop ? 'top' : 'bottom'
  }

  edgePad = (props, currentPosition, windowSize, popoverSize) => {
    return Math.min(
      // upper limit
      windowSize - props.distance - popoverSize,
      // lower limit
      Math.max(props.distance, currentPosition)
    )
  }

  getX = (props, direction, popoverSize, targetBounds) => {
    const VERTICAL = direction === 'top' || direction === 'bottom'
    // find left
    const popoverHalfWidth = popoverSize.width / 2
    const targetCenter = targetBounds.left + targetBounds.width / 2
    const arrowCenter = window.innerWidth - popoverHalfWidth

    let left
    let arrowLeft = 0 // defaults to 0

    // auto for now will just be top/bottom
    // in future it needs to measure target and then determine
    if (VERTICAL) {
      left = this.edgePad(
        props,
        targetCenter - popoverHalfWidth,
        window.innerWidth,
        popoverSize.width
      )

      // find arrowLeft
      if (targetCenter < popoverHalfWidth) {
        arrowLeft = -popoverHalfWidth - targetCenter
      } else if (targetCenter > arrowCenter) {
        arrowLeft = targetCenter - arrowCenter + props.distance
      }

      // arrowLeft bounds
      const max = Math.max(
        0,
        popoverHalfWidth - props.distance - props.arrowSize * 0.5
      )
      const min = -popoverHalfWidth + props.arrowSize * 0.5 + props.distance
      arrowLeft = Math.max(min, Math.min(max, arrowLeft))
      arrowLeft = -(props.arrowSize / 2) + arrowLeft
    } else {
      if (direction === 'left') {
        arrowLeft = targetBounds.width
        left = targetBounds.left - popoverSize.width - props.distance
      } else if (direction === 'right') {
        left = targetBounds.left + targetBounds.width + props.distance
        arrowLeft = -targetBounds.width
      }
    }

    // adjustments
    left += props.adjust[0]

    return { arrowLeft, left }
  }

  getY = (props, direction, popoverSize, targetBounds) => {
    const VERTICAL = direction === 'top' || direction === 'bottom'
    const { forgiveness, noArrow, arrowSize } = props
    // since its rotated 45deg, the real height is less 1/4 of set height
    const arrowHeight = noArrow ? 0 : arrowSize * 0.75
    const targetCenter = targetBounds.top + targetBounds.height / 2
    const targetTopReal = targetBounds.top - window.scrollY

    let arrowTop
    let maxHeight
    let top = null

    // bottom half
    if (VERTICAL) {
      // determine arrow location
      if (direction === 'top') {
        arrowTop = popoverSize.height + arrowSize
        top = targetTopReal - popoverSize.height - arrowHeight - props.distance
        maxHeight = window.innerHeight - targetBounds.height
      } else {
        arrowTop = 0
        top = targetTopReal + targetBounds.height + arrowHeight
        maxHeight =
          window.innerHeight - (targetBounds.top + targetBounds.height)
      }

      // final top
      top = this.edgePad(props, top, window.innerHeight, popoverSize.height)
    } else {
      // left or right
      const yCenter = targetCenter - popoverSize.height / 2
      top = yCenter
      arrowTop = popoverSize.height / 2 - arrowHeight / 2 + forgiveness
    }

    // adjustments
    top += props.adjust[1]

    return { arrowTop, top, maxHeight }
  }

  handleOverlayClick = (event: MouseEvent) => {
    event.stopPropagation()
    this.close()
  }

  // hover helpers
  hoverStateSetter = (name, val) => () => {
    const { openOnHover, onMouseEnter } = this.props
    const setter = () => this.setState({ [`${name}Hovered`]: val })

    if (val) {
      if (openOnHover) {
        this.setPosition(this.props, setter)
      }
      if (onMouseEnter) {
        onMouseEnter()
      }
    } else {
      if (openOnHover) {
        setter()
      }
    }
  }

  listenForHover = () => {
    this.addHoverListeners('target', this.target)
    this.addHoverListeners('menu', this.refs.popover)
  }

  addHoverListeners = (name, node) => {
    if (!node) return

    const setFalse = this.hoverStateSetter(name, false)
    const setTrue = this.hoverStateSetter(name, true)

    this.on(node, 'mouseenter', () => {
      setTrue()
      // insanity, but mouselave is horrible
      if (this.props.target) {
        this.setTimeout(() => !this.isTargetHovered() && setFalse())
        this.setTimeout(() => !this.isTargetHovered() && setFalse(), 10)
        this.setTimeout(() => !this.isTargetHovered() && setFalse(), 40)
      }
    })

    this.on(node, 'mouseleave', setFalse)
  }

  isTargetHovered = () => {
    return (
      this.target.querySelector(':hover') ||
      this.target.parentNode.querySelector(':hover')
    )
  }

  overlayRef = ref => {
    if (ref) {
      this.on(ref, 'contextmenu', this.handleOverlayClick)
    }
  }

  render() {
    const {
      noArrow,
      children,
      arrowSize,
      overlay,
      style,
      background,
      target,
      openOnHover,
      openOnClick,
      passActive,
      open,
      width,
      height,
      popoverProps,
      towards,
      distance,
      escapable,
      onClose,
      padding,
      forgiveness,
      noHover,
      shadow,
      animation,
      popoverStyle,
      top: _top,
      left: _left,
      adjust,
      theme,
      closeOnClickWithin,
      ...props
    } = this.props

    const {
      bottom,
      top,
      left,
      arrowTop,
      arrowLeft,
      isOpen,
      closing,
      maxHeight,
      direction,
    } = this.state

    const openUndef = typeof open === 'undefined'
    const showPopover =
      isOpen ||
      (openUndef &&
        ((openOnHover && this.isHovered()) || (openOnClick && isOpen)))

    const childProps = {
      ref: 'target',
    }

    if (passActive) {
      childProps.active = isOpen && !closing
    }

    return (
      <root {...props}>
        {React.isValidElement(target) && React.cloneElement(target, childProps)}
        <Portal isOpened>
          <container
            data-towards={direction}
            $open={showPopover}
            $closing={closing}
          >
            <background
              if={overlay}
              ref={this.overlayRef}
              $overlay={overlay}
              $overlayShown={showPopover}
              onClick={this.handleOverlayClick}
            />
            <popover
              {...popoverProps}
              $popoverOpen={!closing && showPopover}
              ref="popover"
              style={{
                ...style,
                top: top || 'auto',
                bottom: bottom || 'auto',
                left,
                width,
                height,
                maxHeight,
              }}
            >
              <arrowContain
                if={!noArrow}
                style={{ top: arrowTop, marginLeft: arrowLeft }}
              >
                <Arrow
                  theme={theme}
                  size={arrowSize}
                  towards={INVERSE[direction]}
                />
              </arrowContain>
              <content $withBackground={background}>
                {children}
              </content>
            </popover>
          </container>
        </Portal>
      </root>
    )
  }

  static style = {
    container: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: 101,
      pointerEvents: 'none',
    },
    content: {
      flex: 1,
      overflowY: 'auto',
    },
    open: {
      zIndex: 100000,
    },
    closing: {
      // zIndex: 100000 - 1,
    },
    background: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'transparent',
      pointerEvents: 'none',
      opacity: 0,
      transition: 'all ease-in 300ms',
    },
    overlay: color => ({
      background: typeof color === 'string' ? color : 'rgba(0,0,0,0.2)',
    }),
    overlayShown: {
      opacity: 1,
      pointerEvents: 'all',
    },
    popover: {
      position: 'absolute',
      pointerEvents: 'none',
      opacity: 0,
      transition: 'opacity ease-in 60ms, transform ease-out 100ms',
      transform: {
        y: -5,
      },
    },
    popoverOpen: {
      opacity: 1,
      pointerEvents: 'auto',
      transition: 'transform 0ms',
      transform: {
        y: 0,
      },
    },
    withBackground: background => ({
      borderRadius: 3,
      background,
    }),
    item: {
      minWidth: 120,
    },
    itemFirstChild: {
      borderTop: 'none',
    },
    arrowContain: {
      position: 'absolute',
      left: '50%',
    },
  }

  static theme = {
    theme: (props, context, activeTheme) => ({
      withBackground: activeTheme.base,
    }),
    popoverStyle: ({ popoverStyle }) => ({
      content: popoverStyle,
    }),
    padding: ({ padding }) => ({
      content: {
        padding,
      },
    }),
    animation: ({ animation }) => ({
      popoverOpen: {
        animation: animation === true ? 'bounce-down 200ms' : animation,
      },
    }),
    forgiveness: ({ forgiveness, distance, showForgiveness }) => ({
      popover: {
        padding: maxForgiveness(forgiveness, distance),
        margin: -maxForgiveness(forgiveness, distance),
        background: showForgiveness ? 'green' : 'auto',
      },
    }),
    shadow: ({ shadow }) => ({
      content: {
        boxShadow: shadow === true ? '0 3px 10px rgba(0,0,0,0.1)' : shadow,
      },
    }),
    noHover: {
      popover: {
        pointerEvents: 'none',
      },
    },
  }
}
