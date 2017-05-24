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
  render({ size, towards, theme }) {
    const onBottom = towards === 'bottom'
    const innerTop = size * (onBottom ? -1 : 1)

    return (
      <arrow style={{ width: size, height: size }}>
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
  }

  static theme = {
    theme: (props, state, activeTheme) => ({
      arrowInner: activeTheme,
    }),
  }
}

@view.ui
export default class Popover {
  props: {
    target?: Function | string | Object,
    open?: boolean,
    left?: number,
    top?: number,
    openOnClick?: boolean,
    openOnHover?: boolean,
    escapable?: boolean,
    arrowSize?: number,
    closeOnClickWithin?: boolean,
    towards: 'auto' | 'left' | 'right' | 'bottom' | 'top',
    padding?: Array | number,
    noHover?: boolean,
    onMouseEnter?: Function,
    onMouseLeave?: Function,
    animation?: string,
  }

  static defaultProps = {
    // the distance the popover is from the target
    // so it displays nicely spaced away
    distance: 10,
    arrowSize: 11,
    // will exit with `esc` key
    escapable: true,
    noArrow: false,
    // will open automatically when target is hovered
    openOnHover: false,
    // show a background over content
    overlay: false,
    // will open when target is clicked
    openOnClick: false,
    // the amount of space around popover you can move mouse
    // before it triggers it to close
    forgiveness: 15,
    // which direction it shows towards
    // default will determine direction automatically
    towards: 'auto',
    // animation
    animation: 'slide 200ms',
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

    this.addEvent(
      window,
      'resize',
      debounce(() => {
        this.setPosition(this.props)
      }, 64)
    )

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
      this.addEvent(window, 'keydown', e => {
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
    this.addEvent(this.target, 'click', e => {
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
    this.addEvent(window, 'click', e => {
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

  getPositionState = props => {
    let { width, height } = props
    const { bottom, top, left, towards } = props
    const isManuallyPositioned =
      (isNumber(bottom) || isNumber(top)) && isNumber(left)
    const { popover: { clientWidth, clientHeight } } = this.refs

    if (!this.target && !isManuallyPositioned) {
      throw new Error('No top/left/bottom or target given to Popover!')
    }

    // find popover dimensions
    width = isNumber(width) ? width : clientWidth
    height = isNumber(height) ? height : clientHeight
    const forgiveness = maxForgiveness(props.forgiveness, props.distance)
    height -= forgiveness * 2
    width -= forgiveness * 2

    const target = {}

    // find target dimensions
    if (isManuallyPositioned) {
      target.width = 0
      target.height = 0
      target.left = left
      target.top = top
    } else {
      const bounds = this.target.getBoundingClientRect()
      target.width = bounds.width
      target.height = bounds.height
      target.left = bounds.left
      target.top = bounds.top
    }

    // direction is final direction accounting for towards="auto"
    const direction = this.getDirection(towards, target, width, height)

    return {
      ...this.getX(
        props,
        width,
        target.width,
        target.left,
        towards,
        forgiveness,
        isManuallyPositioned
      ),
      ...this.getY(
        props,
        height,
        target.height,
        target.top,
        towards,
        forgiveness
      ),
      direction,
    }
  }

  getDirection = (towards, target, popoverWidth, popoverHeight) => {
    if (towards !== 'auto') {
      return towards
    }
    // TODO determine direction using popover + target
    return 'bottom'
  }

  edgePad = (props, pos, max, width) => {
    return Math.min(
      // upper limit
      max - props.distance - width,
      // lower limit
      Math.max(props.distance, pos)
    )
  }

  getX = (props, popoverWidth, targetWidth, targetLeft, towards) => {
    // find left
    const popoverHalfWidth = popoverWidth / 2
    const targetCenter = targetLeft + targetWidth / 2
    const arrowCenter = window.innerWidth - popoverHalfWidth

    let left
    let arrowLeft = 0 // defaults to 0

    // auto for now will just be top/bottom
    // in future it needs to measure target and then determine
    if (towards === 'top' || towards === 'bottom' || towards === 'auto') {
      left = this.edgePad(
        props,
        targetCenter - popoverHalfWidth,
        window.innerWidth,
        popoverWidth
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
      if (towards === 'left') {
        arrowLeft = targetWidth
        left = targetLeft - popoverWidth - props.distance
      } else if (towards === 'right') {
        left = targetLeft + targetWidth + props.distance
        arrowLeft = -targetWidth
      }
    }

    return { arrowLeft, left }
  }

  getY = (
    props,
    popoverHeight,
    targetHeight,
    targetTop,
    towards,
    forgiveness
  ) => {
    const { noArrow, arrowSize } = props

    // since its rotated 45deg, the real height is less 1/4 of set height
    const arrowHeight = noArrow ? 0 : arrowSize * 0.75
    const targetCenter = targetTop + targetHeight / 2
    const targetTop$ = targetTop - window.scrollY

    let arrowTop
    let maxHeight
    let top = null
    let bottom = null

    // bottom half
    if (towards === 'auto' || towards === 'top' || towards === 'bottom') {
      // TODO base it on popover height not above half window
      const targetIsAboveHalf = targetCenter > window.innerHeight / 2
      const arrowOnBottom =
        towards === 'top' || (towards === 'auto' && targetIsAboveHalf)

      if (arrowOnBottom) {
        arrowTop = popoverHeight - forgiveness
        top = targetTop$ - popoverHeight - arrowHeight - props.distance
      } else {
        // top half
        arrowTop = -arrowSize + forgiveness
        top = targetTop$ + targetHeight + arrowHeight
      }

      const ensurePad = y =>
        this.edgePad(props, y, window.innerHeight, maxHeight - targetHeight)

      maxHeight = window.innerHeight - (targetTop + targetHeight)
      top = top && ensurePad(top)
      bottom = bottom && ensurePad(bottom)
    } else if (towards === 'left' || towards === 'right') {
      const yCenter = targetCenter - popoverHeight / 2
      top = yCenter
      arrowTop = popoverHeight / 2 - arrowHeight / 2 + forgiveness
    }

    return { arrowTop, top, bottom, maxHeight }
  }

  handleBgClick = e => {
    e.stopPropagation()
    this.close()
  }

  // hover helpers
  hoverStateSetter = (name, val) => () => {
    const { openOnHover, onMouseEnter, onMouseLeave } = this.props
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
      if (onMouseLeave) {
        onMouseLeave()
      }
    }
  }

  listenForHover = () => {
    this.addHoverListeners('target', this.target)
    this.addHoverListeners('menu', this.refs.popover)
  }

  addHoverListeners = (name, node) => {
    if (!node) return
    this.addEvent(node, 'mouseenter', () => {
      this.hoverStateSetter(name, true)()
      // insanity, but mouselave is horrible

      if (this.props.target) {
        this.setTimeout(
          () => !this.isTargetHovered() && this.hoverStateSetter(name, false)()
        )
        this.setTimeout(
          () => !this.isTargetHovered() && this.hoverStateSetter(name, false)(),
          10
        )
        this.setTimeout(
          () => !this.isTargetHovered() && this.hoverStateSetter(name, false)(),
          40
        )
      }
    })
    this.addEvent(node, 'mouseleave', this.hoverStateSetter(name, false))
  }

  isTargetHovered = () => {
    return (
      this.target.querySelector(':hover') ||
      this.target.parentNode.querySelector(':hover')
    )
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
      theme,
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
          <container $open={showPopover} $closing={closing}>
            <background
              if={overlay}
              $overlay={overlay}
              $overlayShown={showPopover}
              onClick={this.handleBgClick}
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
              <content $withBg={background}>
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
      position: 'fixed',
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
      pointerEvents: 'auto',
      opacity: 0,
      transition: 'opacity ease-in 60ms, transform ease-out 100ms',
      transform: {
        y: -5,
      },
    },
    popoverOpen: {
      opacity: 1,
      transition: 'transform 0ms',
      transform: {
        y: 0,
      },
    },
    withBg: background => ({
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
      withBg: activeTheme,
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
    forgiveness: ({ forgiveness, distance }) => ({
      popover: {
        padding: maxForgiveness(forgiveness, distance),
        margin: -maxForgiveness(forgiveness, distance),
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
