// @flow
import React from 'react'
import { view, getTarget } from '@mcro/black'
import Portal from 'react-portal'
import { isNumber, debounce, throttle } from 'lodash'
import Arrow from './arrow'
import { Theme } from '@mcro/gloss'
import Surface from './surface'

export type Props = {
  // can pass function to get isOpen passed in
  children?: React$Element<any> | Function,
  // element or function that returns element, or querySelector to element
  target?: React$Element<any> | (() => React$Element<any>) | string,
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
  // open when target is clicked
  openOnClick?: boolean,
  // open automatically when target is hovered
  openOnHover?: boolean,
  // delay until openOnHover
  delay: number,
  // prevent popover itself from catching pointer events
  noHover?: boolean,
  // exit with `esc` key
  escapable?: boolean,
  // size of shown arrow
  arrowSize?: number,
  closeOnClick?: boolean,
  // which direction it shows towards
  // default determine direction automatically
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
  // padding from edge of window
  edgePadding: number,
  // sway towards mouse
  swayX?: boolean,
}

const INVERSE = {
  top: 'bottom',
  bottom: 'top',
  left: 'right',
  right: 'left',
}

const DEFAULT_SHADOW = '0 0px 2px rgba(0,0,0,0.15)'

const getShadow = shadow => (shadow === true ? DEFAULT_SHADOW : shadow)
const calcForgiveness = (forgiveness, distance) => forgiveness

@view.ui
export default class Popover {
  props: Props

  static defaultProps = {
    edgePadding: 5,
    distance: 10,
    arrowSize: 20,
    forgiveness: 15,
    towards: 'auto',
    animation: 'slide 200ms',
    adjust: [0, 0],
    delay: 16,
  }

  curProps = {}
  popoverRef = null
  targetRef = null

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
    delay: 16,
  }

  // curProps is always up to date, so we dont have to thread props around a ton
  // also, nicely lets us define get fn helpers

  componentWillMount() {
    this.curProps = this.props
  }

  componentWillReceiveProps(nextProps) {
    this.curProps = nextProps
    this.setPosition()
  }

  componentWillUpdate(nextProps) {
    this.setOpenOrClosed(nextProps)
    this.setTarget()
  }

  componentDidMount() {
    const { openOnClick, open, escapable, swayX } = this.curProps

    this.on(window, 'resize', debounce(() => this.setPosition(), 16))
    this.setTarget()
    this.listenForHover()

    if (openOnClick) {
      this.listenForClick()
      this.listenForClickAway()
    }
    if (open) {
      this.open()
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

  swayEvent = null

  startSwaying = () => {
    if (this.props.swayX) {
      this.swayEvent = this.on(
        window,
        'mousemove',
        throttle(event => {
          if (this.showPopover) {
            log('sawy event', event)
          }
        }, 32)
      )
    }
  }

  stopSwaying = () => {
    if (this.swayEvent) {
      this.swayEvent.dispose()
    }
  }

  open = () => {
    this.setPosition(() => {
      this.setState({ isOpen: true }, () => {
        this.startSwaying()
        if (this.curProps.onOpen) {
          this.curProps.onOpen()
        }
      })
    })
  }

  close = (): Promise => {
    return new Promise(resolve => {
      this.stopSwaying()
      this.setState({ closing: true }, () => {
        if (this.curProps.onClose) {
          this.curProps.onClose()
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
      if (typeof this.curProps.open === 'undefined') {
        if (this.state.isOpen) this.close()
        else this.open()
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
      if (this.popoverRef.contains(e.target) && !this.curProps.closeOnClick) {
        return
      }
      if (this.state.isOpen && !this.isClickingTarget) {
        e.preventDefault()
        this.close()
      }
    })
  }

  setTarget = () => {
    this.target = getTarget(this.targetRef || this.curProps.target)
  }

  get isHovered() {
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
        this.setPosition()
      }
      if (!this.state.isOpen && nextProps.open) {
        this.open()
      }
      if (this.state.isOpen && !nextProps.open) {
        this.close()
      }
    }
  }

  setPosition = (callback?: Function) => {
    clearTimeout(this.positionTimeout)
    this.positionTimeout = this.setTimeout(() => {
      if (!this.unmounted) {
        this.setState(this.positionState, callback)
      }
    })
  }

  get forgiveness(): number {
    return calcForgiveness(this.curProps.forgiveness, this.curProps.distance)
  }

  get popoverSize() {
    const { popoverRef, forgiveness } = this
    const { width, height } = this.curProps
    const size = {
      height: isNumber(width) ? width : popoverRef.clientHeight,
      width: isNumber(height) ? height : popoverRef.clientWidth,
    }
    // adjust for forgiveness
    size.height -= forgiveness * 2
    size.width -= forgiveness * 2
    return size
  }

  get targetBounds() {
    const { top, left } = this.curProps
    const bounds = {}
    // find target dimensions
    if (this.isManuallyPositioned) {
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

  get isManuallyPositioned() {
    const { bottom, top, left } = this.curProps
    return (isNumber(bottom) || isNumber(top)) && isNumber(left)
  }

  get positionState() {
    if (!this.target && !this.isManuallyPositioned) {
      console.warn(
        'No top/left/bottom or target given to Popover,',
        'target:',
        this.target,
        'this.props:',
        this.props
      )
      return {}
    }
    return {
      ...this.x,
      ...this.y,
      direction: this.direction,
    }
  }

  get direction() {
    const { forgiveness, popoverSize, targetBounds } = this
    const { towards } = this.curProps
    if (towards !== 'auto') {
      return towards
    }
    const popoverY = popoverSize.height + forgiveness
    const targetY = targetBounds.top + targetBounds.height
    const towardsTop = targetY + popoverY > window.innerHeight
    return towardsTop ? 'top' : 'bottom'
  }

  edgePad = (currentPosition, windowSize, popoverSize) => {
    return Math.min(
      // upper limit
      windowSize - this.curProps.edgePadding - popoverSize,
      // lower limit
      Math.max(this.curProps.edgePadding, currentPosition)
    )
  }

  get x() {
    const { direction, popoverSize, targetBounds } = this
    const VERTICAL = direction === 'top' || direction === 'bottom'
    const { adjust, distance, arrowSize, forgiveness } = this.curProps

    // measurements
    const popoverHalfWidth = popoverSize.width / 2
    const targetCenter = targetBounds.left + targetBounds.width / 2
    const arrowCenter = window.innerWidth - popoverHalfWidth

    let left
    let arrowLeft = 0 // defaults to 0

    // auto for now will just be top/bottom
    // in future it needs to measure target and then determine
    if (VERTICAL) {
      left = this.edgePad(
        targetCenter - popoverHalfWidth,
        window.innerWidth,
        popoverSize.width
      )

      // arrow
      if (targetCenter < popoverHalfWidth) {
        // adjust left
        const edgeAdjustment = left
        arrowLeft = -popoverHalfWidth - targetCenter + edgeAdjustment
      } else if (targetCenter > arrowCenter) {
        // adjust right
        const edgeAdjustment = window.innerWidth - (left + popoverSize.width)
        arrowLeft = targetCenter - arrowCenter + edgeAdjustment
      }

      // arrowLeft bounds
      const max = Math.max(0, popoverHalfWidth - arrowSize * 0.75)
      const min = -popoverHalfWidth + arrowSize * 0.5 + distance
      arrowLeft = Math.max(min, Math.min(max, arrowLeft))
      arrowLeft = -(arrowSize / 2) + arrowLeft

      // adjust arrows off in this case
      // TODO: this isnt quite right
      if (distance > forgiveness) {
        arrowLeft = arrowLeft / 2
      }
    } else {
      if (direction === 'left') {
        arrowLeft = popoverHalfWidth
        left = targetBounds.left - popoverSize.width - distance
      } else {
        left = targetBounds.left + targetBounds.width + distance
        arrowLeft = -popoverHalfWidth - arrowSize
      }
    }

    // adjustments
    left += adjust[0]

    return { arrowLeft, left }
  }

  get y() {
    const { forgiveness, direction, popoverSize, targetBounds } = this
    const VERTICAL = direction === 'top' || direction === 'bottom'
    const { distance, adjust, noArrow, arrowSize } = this.curProps

    // since its rotated 45deg, the real height is less 1/4 of set height
    const arrowHeight = noArrow ? 0 : arrowSize * 0.75
    const targetCenter = targetBounds.top + targetBounds.height / 2
    const targetTopReal = targetBounds.top - window.scrollY

    let arrowTop
    let maxHeight
    let top = null

    const arrowAdjust = Math.max(forgiveness, distance)

    // bottom half
    if (VERTICAL) {
      // determine arrow location
      if (direction === 'top') {
        arrowTop = popoverSize.height + arrowAdjust
        top = targetTopReal - popoverSize.height - distance
        maxHeight = window.innerHeight - targetBounds.height
      } else {
        arrowTop = -arrowSize + arrowAdjust
        top = targetTopReal + targetBounds.height + distance
        maxHeight =
          window.innerHeight - (targetBounds.top + targetBounds.height)
      }

      // final top
      top = this.edgePad(top, window.innerHeight, popoverSize.height)
    } else {
      // left or right
      const yCenter = targetCenter - popoverSize.height / 2
      top = yCenter
      arrowTop = popoverSize.height / 2 - arrowHeight / 2 + forgiveness
    }

    // adjustments
    top += adjust[1]

    return { arrowTop, top, maxHeight }
  }

  handleOverlayClick = (event: MouseEvent) => {
    event.stopPropagation()
    this.close()
  }

  listenForHover = () => {
    this.addHoverListeners('target', this.target)
    if (!this.curProps.noHover) {
      this.addHoverListeners('menu', this.popoverRef)
    }
  }

  addHoverListeners = (name, node) => {
    if (!node) {
      console.log('no node!', name)
      return
    }
    const { delay, noHover } = this.curProps
    const isPopover = name === 'menu'
    const isTarget = name === 'target'
    const setHovered = () => this.hoverStateSet(name, true)
    const setUnhovered = () => this.hoverStateSet(name, false)
    const openIfOver = () => this.isNodeHovered(node, isPopover) && setHovered()
    const closeIfOut = () =>
      !this.isNodeHovered(node, isPopover) && setUnhovered()
    const onEnter = openIfOver
    const onLeave = debounce(closeIfOut, isTarget ? 80 : 20) // 🐛 target should close slower than menu opens

    if (isTarget) {
      // seems to be fixed, leaving in case needs testing
      // if you move your mouse super slowly onto an element, it triggers this ridiculous bug where it doesnt open
      // i think because checking `:hover` in css requires your mouse being >1px inside the element
      // so we also listen for mousemove, super throttled, just to prevent that
      // this.on(
      //   node,
      //   'mousemove',
      //   throttle(
      //     () =>
      //       !this.state.targetHovered &&
      //       this.isNodeHovered(this.target) &&
      //       this.hoverStateSet('target', true),
      //     Math.max(200, delay),
      //     { trailing: false }
      //   )
      // )
    }

    // logic for enter/leave
    this.on(node, 'mouseenter', () => {
      onEnter()
      // insanity, but mouseleave is horrible
      if (this.curProps.target) {
        this.setTimeout(onLeave, 16)
        this.setTimeout(onLeave, 32)
        this.setTimeout(onLeave, 96)
      }
    })

    // if noHover it reduces bugs to just not check hovered state
    const onMouseLeave = noHover ? setUnhovered : onLeave
    this.on(node, 'mouseleave', onMouseLeave)
  }

  // hover helpers
  hoverStateSet = (name, val) => {
    const { openOnHover, onMouseEnter } = this.curProps
    const setter = () => {
      this.setState({ [`${name}Hovered`]: val })
    }

    if (val) {
      if (openOnHover) {
        this.setPosition(setter)
      }
      if (onMouseEnter) {
        onMouseEnter()
      }
    } else {
      if (openOnHover) {
        setter()
      }
    }
    return val
  }

  isNodeHovered = (
    node: HTMLElement,
    checkParent: boolean = false
  ): boolean => {
    return (
      !!node.parentNode.querySelector(`${node.tagName}:hover`) ||
      (checkParent && !!node.parentNode.querySelector(':hover')) ||
      node.querySelector(':hover')
    )
  }

  overlayRef = ref => {
    if (ref) {
      this.on(ref, 'contextmenu', this.handleOverlayClick)
    }
  }

  get showPopover() {
    const { isOpen } = this.state
    const { openOnHover, open, openOnClick } = this.props
    const openUndef = typeof open === 'undefined'
    return (
      open ||
      isOpen ||
      (openUndef &&
        ((openOnHover && this.isHovered) || (openOnClick && isOpen)))
    )
  }

  render({
    adjust,
    animation,
    arrowSize,
    children,
    closeOnClick,
    delay,
    distance,
    edgePadding,
    escapable,
    forgiveness,
    height,
    left: _left,
    noArrow,
    noHover,
    onClose,
    open,
    openOnClick,
    openOnHover,
    overlay,
    passActive,
    popoverProps,
    popoverStyle,
    shadow,
    showForgiveness,
    style,
    swayX,
    target,
    theme,
    top: _top,
    towards,
    width,
    ...props
  }: Props) {
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
    const { showPopover } = this

    const controlledTarget = target => {
      const targetProps = {
        getRef: this.ref('targetRef').set,
      }
      if (passActive) {
        targetProps.active = isOpen && !closing
      }
      if (target.type.acceptsHovered) {
        targetProps.hovered = showPopover
      }
      return React.cloneElement(target, targetProps)
    }

    return (
      <Theme name={theme}>
        <root>
          {React.isValidElement(target) && controlledTarget(target)}
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
                ref={this.ref('popoverRef').set}
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
                  css={{
                    top: arrowTop,
                    marginLeft: arrowLeft,
                    zIndex: 100000000000, // above any shadows
                  }}
                >
                  <Arrow
                    theme={theme}
                    size={arrowSize}
                    towards={INVERSE[direction]}
                    shadow={getShadow(shadow)}
                  />
                </arrowContain>
                <Surface {...props}>
                  {typeof children === 'function' ? children(isOpen) : children}
                </Surface>
              </popover>
            </container>
          </Portal>
        </root>
      </Theme>
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

  static theme = (props, theme) => {
    return {
      popover: {
        padding: calcForgiveness(props.forgiveness, props.distance),
        margin: -calcForgiveness(props.forgiveness, props.distance),
        background: props.showForgiveness ? [250, 250, 0, 0.2] : 'auto',
      },
      popoverOpen: {
        animation:
          props.animation === true ? 'bounce-down 200ms' : props.animation,
      },
    }
  }
}
