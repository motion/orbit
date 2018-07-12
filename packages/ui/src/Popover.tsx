import * as React from 'react'
import { view, on, attachTheme } from '@mcro/black'
import { getTarget } from './helpers/getTarget'
import { Portal } from './helpers/portal'
import { isNumber, debounce, throttle, isEqual } from 'lodash'
import { Arrow } from './Arrow'
import { SizedSurface } from './SizedSurface'
// import isEqual from 'react-fast-compare'
import { Color } from '@mcro/css'

export type PopoverProps = {
  // can pass function to get isOpen passed in
  children?: React.ReactNode | Function
  // element or function that returns element, or querySelector to element
  target?: React.ReactNode | (() => React.ReactNode) | string
  open?: boolean
  // the amount of space around popover you can move mouse
  // before it triggers it to close
  forgiveness: number
  // show a background over content
  overlay?: boolean
  left?: number
  top?: number
  // the distance the popover is from the target
  // so it displays nicely spaced away
  distance: number
  // open when target is clicked
  openOnClick?: boolean
  // open automatically when target is hovered
  openOnHover?: boolean
  // delay until openOnHover
  delay: number
  // prevent popover itself from catching pointer events
  noHoverOnChildren?: boolean
  // size of shown arrow
  arrowSize?: number
  closeOnClick?: boolean
  closeOnEsc?: boolean
  // which direction it shows towards
  // default determine direction automatically
  towards: 'auto' | 'left' | 'right' | 'bottom' | 'top'
  padding?: number[] | number
  onMouseEnter?: Function
  onMouseLeave?: Function
  onClose?: Function
  animation?: string
  // lets you adjust position after target is positioned
  adjust?: number[]
  // hide arrow
  noArrow?: boolean
  // DEBUG: helps you see forgiveness zone
  showForgiveness?: boolean
  // padding from edge of window
  edgePadding: number
  // pretty much what it says, for use with closeOnClick
  keepOpenOnClickTarget?: boolean
  // callback after close
  onDidClose?: Function
  // callback after open
  onDidOpen?: Function
  onOpen?: Function
  height?: number
  width?: number
  background?: Color | boolean
  passActive?: boolean
  popoverProps?: Object
  shadow?: boolean | string
  style?: Object
  elevation?: number
  theme?: Object
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
const calcForgiveness = (forgiveness, _) => forgiveness

@attachTheme
@view.ui
export class Popover extends React.PureComponent<PopoverProps> {
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

  get curProps(): PopoverProps {
    return this.state.props
  }

  target = null
  // TODO: weird unmount/mounted
  unmounted = false
  mounted = false
  isClickingTarget = false
  targetRef = React.createRef()
  popoverRef = null

  setPopoverRef = ref => {
    this.popoverRef = ref
  }

  state = {
    targetHovered: 0,
    menuHovered: 0,
    top: 0,
    left: 0,
    bottom: 0,
    arrowTop: 0,
    arrowLeft: 0,
    arrowInnerTop: 0,
    isOpen: false,
    direction: null,
    delay: 16,
    props: {} as PopoverProps,
    setPosition: false,
  }

  // curProps is always up to date, so we dont have to thread props around a ton
  // also, nicely lets us define get fn helpers

  static getDerivedStateFromProps(props, state) {
    if (!isEqual(props, state.props)) {
      return {
        setPosition: true,
        props,
      }
    }
    if (state.setPosition) {
      return {
        setPosition: false,
      }
    }
    return null
  }

  componentDidMount() {
    this.mounted = true
    const { openOnClick, closeOnClick, closeOnEsc, open } = this.curProps
    this.listenForResize()
    this.setTarget()
    if (openOnClick || closeOnClick) {
      this.listenForClickAway()
    }
    if (open) {
      this.open()
    }
    if (closeOnEsc) {
      on(this, window, 'keyup', e => {
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
    if (this.state.setPosition) {
      this.setPosition()
      this.setOpenOrClosed(this.props)
      this.setTarget()
    }
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
    on(this, window, 'resize', () => {
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

  close = () => {
    return new Promise(resolve => {
      this.setState({ closing: true }, () => {
        if (this.curProps.onClose) {
          this.curProps.onClose()
        }

        on(
          this,
          setTimeout(() => {
            this.setState(
              { closing: false, isOpen: false },
              this.props.onDidClose,
            )
            resolve()
          }, 300),
        )
      })
    })
  }

  targetClickOff = null

  listenForClick = () => {
    if (!this.curProps.openOnClick) {
      return
    }
    if (!(this.target instanceof HTMLElement)) {
      console.log('bad target', this.target, this.props)
      return
    }
    if (this.targetClickOff) {
      this.targetClickOff()
    }
    // click away to close
    this.targetClickOff = on(this, this.target, 'click', e => {
      e.stopPropagation()
      this.isClickingTarget = true
      if (typeof this.curProps.open === 'undefined') {
        if (this.state.isOpen) {
          this.close()
        } else {
          this.open()
        }
      }
      on(
        this,
        setTimeout(() => {
          this.isClickingTarget = false
        }),
      )
    })
  }

  listenForClickAway() {
    on(this, window, 'click', e => {
      const { showPopover, isClickingTarget } = this
      const { keepOpenOnClickTarget, open, closeOnClick } = this.curProps
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
    this.close()
    on(this, setTimeout(() => this.listenForHover(), 100))
  }

  clearHovered() {
    return new Promise(resolve =>
      this.setState({ menuHovered: 0, targetHovered: 0 }, resolve),
    )
  }

  setTarget() {
    this.target = getTarget(
      (this.targetRef && this.targetRef.current) || this.curProps.target,
    )
    console.log('no set it up', this.target, this.targetRef)
    if (this.target) {
      this.listenForClick()
      this.listenForHover()
    }
  }

  get isHovered() {
    const target = this.target
    if (!target) {
      return false
    }
    const { noHoverOnChildren, targetHovered, menuHovered } = this.state
    if (noHoverOnChildren) {
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

  setPosition(callback?) {
    if (!this.popoverRef) {
      return
    }
    if (!this.unmounted) {
      this.setState(this.positionState, callback)
    }
  }

  get forgiveness() {
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
    const bounds = { top: 0, left: 0, width: 0, height: 0 }
    // find target dimensions
    if (this.isManuallyPositioned) {
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
        this.props,
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
    if (!targetBounds || towards !== 'auto') {
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
      Math.max(this.curProps.edgePadding, currentPosition),
    )
  }

  get x() {
    const { direction, popoverSize, targetBounds } = this
    if (!targetBounds) {
      return 0
    }
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
        popoverSize.width,
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
      console.log('nan top')
      debugger
    }
    return { arrowTop, top, maxHeight }
  }

  handleOverlayClick(event) {
    event.stopPropagation()
    this.close()
  }

  listeners = []

  listenForHover() {
    if (!this.curProps.openOnHover) {
      return
    }
    if (!(this.target instanceof HTMLElement)) {
      return
    }
    this.removeListenForHover()
    this.listeners = this.addHoverListeners('target', this.target)
    // noHoverOnChildren === no hover on the actual popover child element
    if (!this.curProps.noHoverOnChildren) {
      this.listeners = [
        ...this.listeners,
        ...this.addHoverListeners('menu', this.popoverRef),
      ]
    }
  }

  removeListenForHover() {
    for (const listener of this.listeners) {
      listener()
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
      return null
    }
    const listeners = []
    const { delay, noHoverOnChildren } = this.curProps
    const isPopover = name === 'menu'
    const isTarget = name === 'target'
    const setHovered = () => {
      this.hoverStateSet(name, true)
    }
    const setUnhovered = () => {
      this.hoverStateSet(name, false)
    }
    const openIfOver = () => {
      if (this.isNodeHovered(node)) {
        setHovered()
      }
    }
    const closeIfOut = () => {
      if (isPopover && Date.now() - this.state.menuHovered < 200) {
        console.log('avoid popover too soon??')
        return null
      }
      if (!this.isNodeHovered(node)) {
        setUnhovered()
        if (delayOpenIfHover.cancel) {
          // cancel previous
          delayOpenIfHover.cancel()
        }
      }
      // ensure check if we have a delay open
      if (delay && isTarget) {
        on(
          this,
          setTimeout(() => {
            if (!this.isNodeHovered(node)) {
              setUnhovered()
            }
          }, delay),
        )
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
      on(this, node, 'mouseenter', () => {
        onEnter()
        // insanity, but mouseleave is horrible
        if (this.curProps.target) {
          on(this, setTimeout(onLeave, 150))
        }
      }),
    )
    // if noHoverOnChildren it reduces bugs to just not check hovered state
    const onMouseLeave = noHoverOnChildren ? setUnhovered : onLeave
    listeners.push(on(this, node, 'mouseleave', onMouseLeave))
    return listeners
  }

  // hover helpers
  hoverStateSet(name, isHovered) {
    const { openOnHover, onMouseEnter } = this.curProps
    const setter = () => {
      // this.lastEvent[val ? 'enter' : 'leave'][name] = Date.now()
      const key = `${name}Hovered`
      this.setState({ [key]: isHovered ? Date.now() : false })
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

  isNodeHovered = node => {
    const childSelector = `${node.tagName.toLowerCase()}.${node.className.replace(
      /\s+/g,
      '.',
    )}:hover`
    return (
      !!node.parentNode.querySelector(childSelector) ||
      node.querySelector(':hover')
    )
  }

  overlayRef = ref => {
    if (ref) {
      on(this, ref, 'contextmenu', e => this.handleOverlayClick(e))
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

  render() {
    const {
      adjust,
      animation,
      arrowSize,
      children,
      closeOnClick,
      delay,
      distance,
      edgePadding,
      forgiveness,
      height,
      left: _left,
      noArrow,
      noHoverOnChildren,
      onClose,
      open,
      openOnClick,
      openOnHover,
      overlay,
      showForgiveness,
      target,
      top: _top,
      towards,
      width,
      keepOpenOnClickTarget,
      onDidOpen,
      closeOnEsc,
      background,
      passActive,
      popoverProps,
      shadow,
      style,
      elevation,
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
    const { showPopover } = this
    const controlledTarget = target => {
      console.warn('set new ref')
      const targetProps = {
        ref: this.targetRef,
        active: false,
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
      <>
        {React.isValidElement(target) && controlledTarget(target)}
        <Portal>
          <div
            $container
            data-towards={direction}
            $open={showPopover}
            $closing={closing}
          >
            <div
              $background
              if={overlay}
              ref={this.overlayRef}
              $overlayShown={showPopover && !closing}
              onClick={e => this.handleOverlayClick(e)}
            />
            <div
              $popover
              {...popoverProps}
              $popoverOpen={!closing && showPopover}
              ref={this.setPopoverRef}
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
              <div
                $arrowContain
                if={!noArrow}
                css={{
                  top: arrowTop,
                  marginLeft: arrowLeft,
                  zIndex: 100000000000, // above any shadows
                }}
              >
                <Arrow
                  background={
                    typeof background === 'string' &&
                    background !== 'transparent'
                      ? background
                      : null
                  }
                  size={arrowSize}
                  towards={INVERSE[direction]}
                  boxShadow={getShadow(shadow, elevation)}
                />
              </div>
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
            </div>
          </div>
        </Portal>
      </>
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

// @ts-ignore
Popover.acceptsHovered = 'open'
