// @flow
import * as React from 'react'
import { view } from '@mcro/black'
import getTarget from './helpers/getTarget'
import Portal from './helpers/portal'
import { isNumber, debounce, throttle } from 'lodash'
import Arrow from './arrow'
import SizedSurface from './sizedSurface'
import Theme from './helpers/theme'
import * as PropTypes from 'prop-types'

export type Props = {
  // can pass function to get isOpen passed in
  children?: React.Element<any> | Function,
  // element or function that returns element, or querySelector to element
  target?: React.Element<any> | (() => React.Element<any>) | string,
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
  // size of shown arrow
  arrowSize?: number,
  closeOnClick?: boolean,
  closeOnEsc?: boolean,
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
  // pretty much what it says, for use with closeOnClick
  keepOpenOnClickTarget?: boolean,
  // callback after close
  onDidClose?: Function,
  // callback after open
  onDidOpen?: Function,
}

const INVERSE = {
  top: 'bottom',
  bottom: 'top',
  left: 'right',
  right: 'left',
}

const DEFAULT_SHADOW = '0 0px 2px rgba(0,0,0,0.15)'
const ELEVATION_SHADOW = x => [0, x * 1.5, x * 3.5, [0, 0, 0, 0.1]]

const getShadow = (shadow, elevation) => {
  let base = shadow === true ? [DEFAULT_SHADOW] : shadow || []
  if (!Array.isArray(base)) base = [base]
  if (elevation) {
    base.push(ELEVATION_SHADOW(elevation))
  }
  return base
}
const calcForgiveness = (forgiveness, distance) => forgiveness

@view.ui
class Popover extends React.PureComponent<Props> {
  static acceptsHovered = 'open'
  static defaultProps = {
    edgePadding: 5,
    distance: 10,
    arrowSize: 24,
    forgiveness: 15,
    towards: 'auto',
    animation: 'slide 300ms',
    adjust: [0, 0],
    delay: 16,
  }
  static contextTypes = {
    uiThemes: PropTypes.object,
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

  componentWillReceiveProps = nextProps => {
    this.curProps = nextProps
    this.setPosition()
  }

  componentWillUpdate = nextProps => {
    this.setOpenOrClosed(nextProps)
    this.setTarget()
  }

  componentDidMount() {
    this.mounted = true
    const { openOnClick, closeOnClick, closeOnEsc, open } = this.curProps

    this.listenForResize()
    this.setTarget()
    this.listenForHover()

    if (openOnClick) {
      this.listenForClick()
    }
    if (openOnClick || closeOnClick) {
      this.listenForClickAway()
    }
    if (open) {
      this.open()
    }
    if (closeOnEsc) {
      this.on(window, 'keyup', e => {
        if (e.keyCode === 27 && this.showPopover) {
          e.preventDefault()
          e.stopPropagation()
          this.close()
        }
      })
    }
  }

  componentWillUnmount() {
    this.unmounted = true
  }

  shouldSendDidOpen = true

  componentDidUpdate() {
    if (this.props.onDidOpen) {
      if (this.shouldSendDidOpen && this.showPopover) {
        this.props.onDidOpen()
        this.shouldSendDidOpen = false
      } else if (!this.shouldSendDidOpen && !this.showPopover) {
        this.shouldSendDidOpen = true
      }
    }
  }

  listenForResize() {
    const updatePosition = throttle(() => this.setPosition(), 32)
    const updatePositionInactive = debounce(() => this.setPosition(), 300)
    this.on(window, 'resize', () => {
      if (this.showPopover) {
        updatePosition()
      } else {
        updatePositionInactive()
      }
    })
  }

  open() {
    this.setPosition(() => {
      this.setState({ isOpen: true }, () => {
        if (this.curProps.onOpen) {
          this.curProps.onOpen()
        }
      })
    })
  }

  close = (): Promise => {
    return new Promise(resolve => {
      this.setState({ closing: true }, () => {
        if (this.curProps.onClose) {
          this.curProps.onClose()
        }

        this.closingTimeout = this.setTimeout(() => {
          this.setState(
            { closing: false, isOpen: false },
            this.props.onDidClose
          )
          resolve()
        }, 300)
      })
    })
  }

  listenForClick = () => {
    if (!(this.target instanceof HTMLElement)) {
      console.log('bad target', this.target, this.props)
      return
    }
    // click away to close
    this.on(this.target, 'click', e => {
      e.stopPropagation()
      this.isClickingTarget = true
      if (typeof this.curProps.open === 'undefined') {
        if (this.state.isOpen) {
          this.close()
        } else {
          this.open()
        }
      }
      this.setTimeout(() => {
        this.isClickingTarget = false
      })
    })
  }

  listenForClickAway() {
    this.on(window, 'click', e => {
      const { showPopover, isClickingTarget, keepOpenOnClickTarget } = this
      const { open, closeOnClick } = this.curProps
      // forced open or hidden
      if (open || !showPopover) {
        return
      }
      // closeOnClickPopover
      if (closeOnClick && !isClickingTarget) {
        this.stopListeningUntilNextMouseEnter()
        this.close()
        e.stopPropagation()
        return
      }
      // closeOnClickTarget
      if (!keepOpenOnClickTarget && isClickingTarget) {
        this.close()
        e.stopPropagation()
      }
    })
  }

  async stopListeningUntilNextMouseEnter() {
    await this.clearHovered()
    this.removeListenForHover()
    this.close()
    this.setTimeout(this.listenForHover, 100)
  }

  clearHovered() {
    return new Promise(resolve =>
      this.setState({ menuHovered: false, targetHovered: false }, resolve)
    )
  }

  setTarget() {
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
  setOpenOrClosed(nextProps) {
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

  setPosition(callback?: Function) {
    if (!this.popoverRef) {
      return
    }
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
      if (!this.target) {
        return false
      } else {
        if (this.target.getBoundingClientRect) {
          const targetBounds = this.target.getBoundingClientRect()
          bounds.width = targetBounds.width
          bounds.height = targetBounds.height
          bounds.left = targetBounds.left
          bounds.top = targetBounds.top
        }
      }
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
    if (this.targetBounds === false) {
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

  edgePad(currentPosition, windowSize, popoverSize) {
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
        // ON LEFT SIDE
        const edgeAdjustment = left
        arrowLeft = -popoverHalfWidth + targetCenter - edgeAdjustment
      } else if (targetCenter > arrowCenter) {
        // ON RIGHT SIDE
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
      // HORIZONTAL
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
    arrowLeft -= adjust[0]

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
      } else {
        arrowTop = -arrowSize + arrowAdjust
        top = targetTopReal + targetBounds.height + distance
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
    arrowTop -= adjust[1]

    // max height
    if (VERTICAL) {
      if (direction === 'top') {
        maxHeight = targetBounds.top - top + forgiveness * 2 - arrowSize / 2
      } else {
        maxHeight =
          window.innerHeight - (targetBounds.top + targetBounds.height)
      }
    }

    if (isNaN(top)) {
      debugger
    }

    return { arrowTop, top, maxHeight }
  }

  handleOverlayClick(event: MouseEvent) {
    event.stopPropagation()
    this.close()
  }

  listeners = []

  listenForHover() {
    if (!(this.target instanceof HTMLElement)) {
      return
    }
    this.listeners = this.addHoverListeners('target', this.target)
    if (!this.curProps.noHover) {
      this.listeners = [
        ...this.listeners,
        ...this.addHoverListeners('menu', this.popoverRef),
      ]
    }
  }

  removeListenForHover() {
    for (const listener of this.listeners) {
      listener.dispose()
    }
    this.listeners = []
  }

  lastEvent = {
    leave: { target: null, menu: null },
    enter: { target: null, menu: null },
  }

  addHoverListeners(name, node) {
    if (!(node instanceof HTMLElement)) {
      console.log('no node!', name)
      return
    }
    const listeners = []
    const { delay, noHover } = this.curProps
    const isPopover = name === 'menu'
    const isTarget = name === 'target'
    const setHovered = () => this.hoverStateSet(name, true)
    const setUnhovered = () => this.hoverStateSet(name, false)
    const openIfOver = () => {
      if (this.isNodeHovered(node)) {
        setHovered()
      }
    }
    const closeIfOut = () => {
      if (isPopover && Date.now() - this.state.menuHovered < 200) {
        return
      }
      if (!this.isNodeHovered(node)) {
        setUnhovered()
        if (delayOpenIfHover.cancel) {
          // cancel previous
          delayOpenIfHover.cancel()
        }
      }
    }
    const delayOpenIfHover = isTarget ? debounce(openIfOver, delay) : openIfOver
    // this will avoid the delay open if its already open
    const onEnter = () => {
      if (isTarget && this.state.menuHovered) {
        openIfOver()
      } else {
        delayOpenIfHover()
      }
    }
    // 🐛 target should close slower than menu opens
    const onLeave = isTarget ? debounce(closeIfOut, 80) : closeIfOut
    // logic for enter/leave
    listeners.push(
      this.on(node, 'mouseenter', () => {
        onEnter()
        // insanity, but mouseleave is horrible
        if (this.curProps.target) {
          this.setTimeout(onLeave, 150)
        }
      })
    )
    // if noHover it reduces bugs to just not check hovered state
    const onMouseLeave = noHover ? setUnhovered : onLeave
    listeners.push(this.on(node, 'mouseleave', onMouseLeave))
    return listeners
  }

  // hover helpers
  hoverStateSet(name, isHovered) {
    const { openOnHover, onMouseEnter } = this.curProps
    const setter = () => {
      // this.lastEvent[val ? 'enter' : 'leave'][name] = Date.now()
      this.setState({ [`${name}Hovered`]: isHovered ? Date.now() : false })
    }
    if (isHovered) {
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
    return isHovered
  }

  isNodeHovered = (node: HTMLElement): boolean => {
    const childSelector = `${node.tagName.toLowerCase()}.${node.className.replace(
      /\s+/g,
      '.'
    )}:hover`
    return (
      !!node.parentNode.querySelector(childSelector) ||
      node.querySelector(':hover')
    )
  }

  overlayRef = ref => {
    if (ref) {
      this.on(ref, 'contextmenu', e => this.handleOverlayClick(e))
    }
  }

  get showPopover() {
    const { isOpen } = this.state
    const { openOnHover, open, openOnClick } = this.props
    if (!this.mounted) return false
    if (open || isOpen) return true
    if (typeof open === 'undefined') {
      return (openOnHover && this.isHovered) || (openOnClick && isOpen)
    }
  }

  render({
    adjust,
    animation,
    arrowSize,
    background,
    children,
    closeOnClick,
    delay,
    distance,
    edgePadding,
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
    shadow,
    showForgiveness,
    style,
    target,
    theme,
    top: _top,
    towards,
    width,
    elevation,
    keepOpenOnClickTarget,
    onDidOpen,
    closeOnEsc,
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
        ref: this.ref('targetRef').set,
      }
      if (passActive) {
        targetProps.active = isOpen && !closing
      }
      const { acceptsHovered } = target.type
      if (acceptsHovered) {
        targetProps[
          acceptsHovered === true ? 'hovered' : acceptsHovered
        ] = showPopover
      }
      return React.cloneElement(target, targetProps)
    }

    return (
      <root>
        {React.isValidElement(target) && controlledTarget(target)}
        <Portal>
          <container
            data-towards={direction}
            $open={showPopover}
            $closing={closing}
          >
            <background
              if={overlay}
              ref={this.overlayRef}
              $overlayShown={showPopover && !closing}
              onClick={e => this.handleOverlayClick(e)}
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
                // because things that extend downwards wont always fill all the way
                // so arrow will be floating, so lets make it always expand fully down
                // when the popover arrow is at bottom
                height: direction === 'top' ? height || maxHeight : height,
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
                  theme={
                    this.context.uiThemes &&
                    this.context.uiThemes[theme] &&
                    this.context.uiThemes[theme].base
                  }
                  background={background !== 'transparent' ? background : null}
                  size={arrowSize}
                  towards={INVERSE[direction]}
                  boxShadow={getShadow(shadow, elevation)}
                />
              </arrowContain>
              <Theme name={theme}>
                <SizedSurface
                  sizeRadius
                  ignoreSegment
                  flex={1}
                  {...props}
                  elevation={elevation}
                  background={background}
                >
                  {typeof children === 'function'
                    ? children(showPopover)
                    : children}
                </SizedSurface>
              </Theme>
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
      '& > *': {
        pointerEvents: 'none !important',
      },
    },
    content: {
      flex: 1,
    },
    open: {
      zIndex: Number.MAX_SAFE_INTEGER,
      '& > *': {
        pointerEvents: 'all !important',
      },
    },
    closing: {
      zIndex: Number.MAX_SAFE_INTEGER - 1,
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
      transition: 'all ease-in 100ms',
      zIndex: -2,
    },
    overlayShown: {
      opacity: 1,
      pointerEvents: 'all',
    },
    popover: {
      position: 'absolute',
      pointerEvents: 'none',
      zIndex: -1,
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

  static theme = props => {
    return {
      popover: {
        padding: calcForgiveness(props.forgiveness, props.distance),
        margin: -calcForgiveness(props.forgiveness, props.distance),
        background: props.showForgiveness ? [250, 250, 0, 0.2] : 'auto',
      },
      popoverOpen: {
        animation: props.animation === true ? 'bounce 200ms' : props.animation,
      },
      background: {
        background: props.overlay === true ? 'rgba(0,0,0,0.2)' : props.overlay,
      },
    }
  }
}

Popover.acceptsHovered = 'open'

export default Popover
