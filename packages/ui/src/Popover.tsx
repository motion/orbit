import * as React from 'react'
import { view, on } from '@mcro/black'
import { Portal } from './helpers/portal'
import { isNumber, debounce, throttle, Cancelable, last } from 'lodash'
import { Arrow } from './Arrow'
import { SizedSurface } from './SizedSurface'
import { Color, CSSPropertySet } from '@mcro/css'
import { findDOMNode } from 'react-dom'
import { Theme } from '@mcro/gloss'
import { getTarget } from './helpers/getTarget'
import { MergeUIContext } from './helpers/contexts'

const ArrowContain = view({
  position: 'absolute',
  left: '50%',
})

type DebouncedFn = Cancelable & (() => void)
type PopoverDirection = 'top' | 'bottom' | 'left' | 'right' | 'auto'
type PositionStateX = { arrowLeft: number; left: number }
type PositionStateY = { arrowTop: number; top: number; maxHeight: number }
type Bounds = { top: number; left: number; width: number; height: number }

const OpenPopovers = new Set()

export const PopoverState = {
  openPopovers: OpenPopovers,
  closeLast: () => {
    last([...OpenPopovers]).forceClose()
  },
  closeAll: () => {
    ;[...OpenPopovers].map(x => x.forceClose())
  },
}

const getIsManuallyPositioned = ({ top, left }: { top?: number; left?: number }) => {
  return isNumber(top) && isNumber(left)
}

const getPositionState = (props: PopoverProps, popoverBounds: Bounds, targetBounds?: Bounds) => {
  const forgiveness = getForgiveness(props)
  const popoverSize = getPopoverSize(popoverBounds, forgiveness)
  const direction = getDirection(props, popoverSize, forgiveness, targetBounds)
  return {
    ...positionStateX(props, popoverBounds, direction, forgiveness, targetBounds),
    ...positionStateY(props, popoverBounds, direction, forgiveness, targetBounds),
    direction,
  }
}

const getForgiveness = (props: PopoverProps) => {
  return props.forgiveness > props.distance ? props.distance : props.forgiveness
}

const getPopoverSize = ({ width, height }: PopoverProps, forgiveness: number) => {
  return {
    height: height - forgiveness * 2,
    width: width - forgiveness * 2,
  }
}

const getDirection = (
  props: PopoverProps,
  popoverSize,
  forgiveness: number,
  targetBounds?: Bounds,
): PopoverDirection => {
  if (!targetBounds || props.towards !== 'auto') {
    return props.towards
  }
  const popoverY = popoverSize.height + forgiveness
  const targetY = targetBounds.top + targetBounds.height
  const towardsTop = targetY + popoverY > window.innerHeight
  return towardsTop ? 'top' : 'bottom'
}

const getEdgePadding = (props: PopoverProps, currentPosition, windowSize, popoverSize) => {
  return Math.min(
    // upper limit
    windowSize - props.edgePadding - popoverSize,
    // lower limit
    Math.max(props.edgePadding, currentPosition),
  )
}

const positionStateY = (
  props: PopoverProps,
  popoverSize: Bounds,
  direction: PopoverDirection,
  forgiveness: number,
  targetBounds?: Bounds,
): PositionStateY => {
  const { distance, adjust, noArrow, arrowSize } = props
  const VERTICAL = direction === 'top' || direction === 'bottom'

  // since its rotated 45deg, the real height is less 1/4 of set height
  const arrowHeight = noArrow ? 0 : arrowSize * 0.75
  const targetCenter = targetBounds
    ? targetBounds.top + targetBounds.height / 2
    : popoverSize.height / 2
  const targetTopReal = targetBounds ? targetBounds.top - window.scrollY : popoverSize.top

  let arrowTop
  let maxHeight
  let top = 0

  const arrowAdjust = distance

  // bottom half
  if (VERTICAL) {
    // determine arrow location
    if (direction === 'top') {
      arrowTop = popoverSize.height + arrowAdjust
      top = targetTopReal - popoverSize.height - distance
    } else {
      arrowTop = -arrowSize + arrowAdjust
      top = targetTopReal + (targetBounds ? targetBounds.height : 0) + distance
    }

    // final top
    top = getEdgePadding(props, top, window.innerHeight, popoverSize.height)
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
      maxHeight = (targetBounds ? targetBounds.top : 0) - top + forgiveness * 2 - arrowSize / 2
    } else {
      maxHeight = window.innerHeight - (targetBounds ? targetBounds.top + targetBounds.height : 0)
    }
  }

  return { arrowTop, top, maxHeight }
}

const positionStateX = (
  props: PopoverProps,
  popoverSize: Bounds,
  direction: PopoverDirection,
  forgiveness: number,
  targetBounds?: Bounds,
): PositionStateX => {
  const { alignPopover, adjust, distance, arrowSize } = props
  const popoverHalfWidth = popoverSize.width / 2
  const targetCenter = targetBounds
    ? targetBounds.left + targetBounds.width / 2
    : popoverHalfWidth + popoverSize.left
  const arrowPastThisAdjustsRight = window.innerWidth - popoverHalfWidth
  const shouldAdjustRight = targetCenter > arrowPastThisAdjustsRight

  let popoverCenter = targetCenter
  let left = 0
  let arrowLeft = 0

  if (alignPopover === 'left') {
    popoverCenter = targetBounds ? targetBounds.left : popoverSize.left
  }

  switch (direction) {
    case 'top':
    case 'bottom':
      left = getEdgePadding(
        props,
        popoverCenter - popoverHalfWidth,
        window.innerWidth,
        popoverSize.width,
      )

      // arrow
      if (targetCenter < popoverHalfWidth) {
        // ON LEFT SIDE
        const edgeAdjustment = left
        arrowLeft = -popoverHalfWidth + targetCenter - edgeAdjustment
      } else if (shouldAdjustRight) {
        // ON RIGHT SIDE
        const edgeAdjustment = window.innerWidth - (left + popoverSize.width)
        arrowLeft = targetCenter - arrowPastThisAdjustsRight + edgeAdjustment
      }

      // this is a stupid hack
      // what it should be is we should have an prop for parentBounds
      if (shouldAdjustRight || adjust[0]) {
        left += forgiveness
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

      break
    case 'left':
      arrowLeft = popoverHalfWidth
      left = (targetBounds ? targetBounds.left : 0) - popoverSize.width - distance
      break
    case 'right':
      left = (targetBounds ? targetBounds.left + targetBounds.width : 0) + distance
      arrowLeft = -popoverHalfWidth - arrowSize
      break
  }

  // adjustments
  left += adjust[0]
  arrowLeft -= adjust[0]

  // adjust arrow for alignment
  if (alignPopover === 'left') {
    // move it back to the left the amount we move popover right
    arrowLeft += targetCenter - targetBounds.left
  }

  return { arrowLeft, left }
}

export type PopoverChildrenFn = ((showPopover: boolean) => React.ReactNode)

export type PopoverProps = CSSPropertySet & {
  // if you set a group, it acts as an ID that makes sure only ONE popover
  // within that ID is ever open
  group?: string
  theme?: string
  // can pass function to get isOpen passed in
  children?: React.ReactNode | PopoverChildrenFn
  // element or function that returns element, or querySelector to element
  target?: React.ReactNode | (() => React.ReactNode) | string
  open?: boolean
  // the amount of space around popover you can move mouse
  // before it triggers it to close
  forgiveness?: number
  // show a background over content
  overlay?: boolean
  left?: number
  top?: number
  // the distance the popover is from the target
  // so it displays nicely spaced away
  distance?: number
  // open when target is clicked
  openOnClick?: boolean
  // open automatically when target is hovered
  openOnHover?: boolean
  // delay until openOnHover
  delay?: number
  // prevent popover itself from catching pointer events
  noHoverOnChildren?: boolean
  // size of shown arrow
  arrowSize?: number
  // close when you click outside it
  closeOnClickAway?: boolean
  // close when you click inside it
  closeOnClick?: boolean
  closeOnEsc?: boolean
  // which direction it shows towards
  // default determine direction automatically
  towards?: PopoverDirection
  // popover can aim to be centered or left aligned on the target
  alignPopover?: 'left' | 'center'
  padding?: number[] | number
  onMouseEnter?: Function
  onMouseLeave?: Function
  onClose?: Function
  openAnimation?: string
  closeAnimation?: string
  // lets you adjust position after target is positioned
  adjust?: number[]
  // hide arrow
  noArrow?: boolean
  // DEBUG: helps you see forgiveness zone
  showForgiveness?: boolean
  // padding from edge of window
  edgePadding?: number
  // pretty much what it says, for use with closeOnClick
  keepOpenOnClickTarget?: boolean
  // callback after close
  onDidClose?: Function
  // callback after open
  onDidOpen?: Function
  onOpen?: Function
  height?: number
  width?: number
  background?: true | Color
  passActive?: boolean
  popoverProps?: Object
  shadow?: boolean | string
  style?: Object
  elevation?: number
  ignoreSegment?: boolean
  onChangeVisibility?: (visibility: boolean) => any
}

const PopoverContainer = view({
  opacity: 0,
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
  isPositioned: {
    opacity: 1,
  },
  isOpen: {
    zIndex: 5000,
    '& > *': {
      pointerEvents: 'all !important',
    },
  },
  isClosing: {
    zIndex: 5000 - 1,
  },
  isMeasuring: {
    opacity: 0,
  },
})

const Overlay = view({
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
  isShown: {
    opacity: 1,
    pointerEvents: 'all',
  },
}).theme(({ overlay }) => ({
  background: overlay === true ? 'rgba(0,0,0,0.2)' : overlay,
}))

const PopoverWrap = view({
  position: 'absolute',
  pointerEvents: 'none',
  zIndex: -1,
}).theme(p => {
  const forgiveness = getForgiveness(p)
  return {
    width: p.width,
    height: p.height,
    maxHeight: p.maxHeight,
    transition: p.willReposition
      ? 'none'
      : p.transition || 'opacity ease-in 60ms, transform ease-out 100ms',
    opacity: p.isOpen && !p.willReposition ? 1 : 0,
    pointerEvents: p.isOpen ? 'auto' : 'none',
    transform: {
      x: p.left,
      y: (p.isOpen && !p.willReposition ? 0 : -5) + p.top,
    },
    padding: forgiveness,
    margin: -forgiveness,
    background: p.showForgiveness ? [250, 250, 0, 0.2] : 'auto',
    animation: p.animation,
  }
})

const INVERSE = {
  top: 'bottom',
  bottom: 'top',
  left: 'right',
  right: 'left',
}

const DEFAULT_SHADOW = '0 0px 2px rgba(0,0,0,0.15)'
const smoother = (base, amt) => (Math.log(Math.max(1, base)) + 1) * amt
const elevatedShadow = x => [0, smoother(x, 6), smoother(x, 18), [0, 0, 0, 0.15 * smoother(x, 1)]]

const getShadow = (shadow, elevation) => {
  let base = shadow === true ? [DEFAULT_SHADOW] : shadow || []
  if (!Array.isArray(base)) base = [base]
  if (elevation) {
    base.push(elevatedShadow(elevation))
  }
  return base
}

const initialState = {
  showPopover: false,
  targetHovered: 0,
  menuHovered: 0,
  top: 0,
  left: 0,
  arrowTop: 0,
  arrowLeft: 0,
  arrowInnerTop: 0,
  isPinnedOpen: 0,
  isOpen: false,
  direction: null as PopoverDirection,
  delay: 16,
  props: {} as PopoverProps,
  shouldSetPosition: false,
  closing: false,
  maxHeight: null,
  targetBounds: null,
  popoverBounds: null,
  hasFinishedFirstMeasure: false,
}

type State = typeof initialState

const isHovered = (props: PopoverProps, state: State) => {
  const { targetHovered, menuHovered } = state
  if (props.noHoverOnChildren) {
    return targetHovered
  }
  return targetHovered || menuHovered
}

const showPopover = (props: PopoverProps, state: State) => {
  const { isOpen, isPinnedOpen } = state
  const { openOnHover, open } = props
  if (open || isOpen || isPinnedOpen) {
    return true
  }
  if (typeof open === 'undefined') {
    return !!(openOnHover && isHovered(props, state))
  }
  return false
}

export class Popover extends React.PureComponent<PopoverProps, State> {
  static acceptsHovered = 'open'
  static defaultProps = {
    edgePadding: 5,
    distance: 14,
    arrowSize: 14,
    forgiveness: 20,
    towards: 'auto',
    openAnimation: 'slide 300ms',
    closeAnimation: 'bounce 300ms',
    adjust: [0, 0],
    delay: 16,
  }

  target = null
  // TODO: weird unmount/mounted
  unmounted = false
  mounted = false
  targetRef = React.createRef<HTMLDivElement>()
  popoverRef = null

  state = initialState

  static getDerivedStateFromProps(props, state) {
    let nextState: Partial<Popover['state']> = {}
    const isManuallyPositioned = getIsManuallyPositioned(props)

    if (isManuallyPositioned) {
      nextState = {
        ...nextState,
        ...getPositionState(props, {
          width: props.width,
          height: props.height,
          top: props.top,
          left: props.left,
        }),
        props,
      }
    } else if (state.shouldSetPosition) {
      nextState = {
        ...nextState,
        shouldSetPosition: false,
        ...getPositionState(props, state.popoverBounds, state.targetBounds),
        props,
      }
    }

    const nextShow = showPopover(props, state)
    if (nextShow !== state.showPopover) {
      nextState.showPopover = nextShow
    }

    if (!Object.keys(nextState).length) {
      return null
    }

    return nextState
  }

  setPopoverRef = ref => {
    this.popoverRef = ref
  }

  componentDidMount() {
    const { openOnClick, closeOnClick, closeOnClickAway, closeOnEsc, open, target } = this.props

    this.listenForResize()

    if (openOnClick || closeOnClick || closeOnClickAway) {
      this.listenForClickAway()
    }
    if (open) {
      this.open()
    }

    // allow multiple flexible ways to pass in targets
    if (typeof target === 'string') {
      this.target = getTarget(target)
    } else {
      const child = findDOMNode(this) as HTMLDivElement
      const target = child.classList.contains('popover-target')
      if (target) {
        this.target = child
      }
    }

    if (this.target) {
      this.setPosition()
      this.listenForClick()
      this.listenForHover()
      on(this, this.target, 'click', this.handleTargetClick)
      if (closeOnEsc) {
        on(this, findDOMNode(this).parentNode.querySelector('.popover-portal'), 'keyup', e => {
          if (e.keyCode === 27) {
            e.preventDefault()
            e.stopPropagation()
            this.forceClose()
          }
        })
      }
    }
  }

  get showPopover() {
    return this.props.open || this.state.showPopover
  }

  componentDidUpdate(_prevProps, prevState) {
    if (this.state.top !== 0 && this.state.hasFinishedFirstMeasure === false) {
      const tm = setTimeout(() => {
        this.setState({
          hasFinishedFirstMeasure: true,
        })
      }, 200)
      on(this, tm)
    }
    if (this.props.onChangeVisibility) {
      if (prevState.showPopover !== this.state.showPopover) {
        this.props.onChangeVisibility(this.state.showPopover)
      }
    }
    if (this.showPopover) {
      PopoverState.openPopovers.add(this)
      this.closeOthersWithinGroup()
    } else {
      PopoverState.openPopovers.delete(this)
    }
    if (this.props.onDidOpen) {
      if (this.showPopover) {
        this.props.onDidOpen()
      }
    }
  }

  setPosition() {
    if (getIsManuallyPositioned(this.props)) {
      throw new Error('Should never call setPosition when manually positioned')
    }
    if (!this.popoverRef || !this.target) {
      console.error('missing popvoer ref or target', this)
      return
    }
    this.setState({
      shouldSetPosition: true,
      targetBounds: this.target.getBoundingClientRect(),
      popoverBounds: this.popoverRef.getBoundingClientRect(),
    })
  }

  listenForResize() {
    if (!getIsManuallyPositioned(this.props)) {
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
  }

  forceClose = async () => {
    this.stopListeningUntilNextMouseEnter()
    await this.startClosing()
    this.setState({ closing: false, isPinnedOpen: 0, isOpen: false })
  }

  toggleOpen = () => {
    if (this.showPopover) {
      this.forceClose()
    } else {
      this.open()
    }
  }

  open = () => {
    this.setState({ isOpen: true }, () => {
      if (this.props.onOpen) {
        this.props.onOpen()
      }
    })
  }

  startClosing = () => {
    return new Promise(async resolve => {
      this.setState({ closing: true }, () => {
        if (this.props.onClose) {
          this.props.onClose()
        }
        setTimeout(resolve, 300)
      })
    })
  }

  close = async () => {
    await this.startClosing()
    this.setState({ closing: false, isOpen: false })
    if (this.props.onDidClose) {
      this.props.onDidClose()
    }
  }

  targetClickOff = null

  listenForClick = () => {
    if (!this.props.openOnClick) {
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
      if (this.state.isPinnedOpen) {
        this.forceClose()
      } else {
        this.setState({ isPinnedOpen: Date.now() })
      }
    })
  }

  get wasJustClicked() {
    return Date.now() - this.state.isPinnedOpen < 10
  }

  listenForClickAway() {
    on(this, window, 'click', e => {
      const { showPopover } = this
      const { keepOpenOnClickTarget, open, closeOnClick, closeOnClickAway } = this.props
      // forced open or hidden
      if (open || !showPopover) {
        return
      }
      const clickedTarget = this.wasJustClicked
      if (keepOpenOnClickTarget && clickedTarget) {
        return
      }
      // closeOnClickPopover
      if (closeOnClick && clickedTarget) {
        this.forceClose()
        e.stopPropagation()
        return
      }
      const clickedInPopover =
        e.path.findIndex(
          x => x instanceof HTMLDivElement && x.classList.contains('popover-portal'),
        ) > -1
      if (closeOnClickAway && !clickedTarget && !clickedInPopover) {
        console.log('close on away', clickedInPopover)
        this.forceClose()
        e.stopPropagation()
        return
      }
    })
  }

  private stopListeningUntilNextMouseEnter = async () => {
    if (this.state.isPinnedOpen) {
      return
    }
    const hovered = this.isHovered
    this.cancelIfWillOpen()
    await this.clearHovered()
    this.close()
    // after click, remove hover listeners until mouseleave
    if (hovered) {
      this.removeListeners()
      const off = on(this, this.target, 'mouseleave', () => {
        off()
        this.listenForHover()
      })
    }
  }

  clearHovered() {
    return new Promise(resolve => this.setState({ menuHovered: 0, targetHovered: 0 }, resolve))
  }

  get isHovered() {
    return isHovered(this.props, this.state)
  }

  handleOverlayClick(event) {
    event.stopPropagation()
    this.close()
  }

  listeners = []

  listenForHover() {
    if (!this.props.openOnHover) {
      return
    }
    if (!(this.target instanceof HTMLElement)) {
      return
    }
    this.removeListeners()
    this.addHoverListeners('target', this.target)
    // noHoverOnChildren === no hover on the actual popover child element
    if (!this.props.noHoverOnChildren) {
      this.addHoverListeners('menu', this.popoverRef)
    }
  }

  removeListeners() {
    for (const listener of this.listeners) {
      listener()
    }
    this.listeners = []
  }

  delayOpenIfHover = {
    target: null as DebouncedFn,
    menu: null as DebouncedFn,
  }

  private cancelIfWillOpen() {
    for (const key in this.delayOpenIfHover) {
      const fn = this.delayOpenIfHover[key]
      if (fn && fn.cancel) {
        fn.cancel()
      }
    }
  }

  addHoverListeners(name, node) {
    if (!(node instanceof HTMLElement)) {
      console.log('no node!', name)
      return null
    }
    const listeners = []
    const { delay, noHoverOnChildren } = this.props
    const isPopover = name === 'menu'
    const isTarget = name === 'target'
    const setHovered = () => this.hoverStateSet(name, true)
    const setUnhovered = () => this.hoverStateSet(name, false)
    const openIfOver = () => {
      if (this.isNodeHovered(node)) {
        setHovered()
      }
    }

    this.cancelIfWillOpen()
    this.delayOpenIfHover[name] = debounce(openIfOver, isTarget ? delay : 0)
    let retryOutTm = null

    const unhover = () => {
      if (!this.isNodeHovered(node)) {
        setUnhovered()
        this.cancelIfWillOpen()
      }
    }

    const closeIfOut = () => {
      clearTimeout(retryOutTm)
      // avoid if too soon
      if (isPopover && Date.now() - this.state.menuHovered < 200) {
        retryOutTm = setTimeout(closeIfOut, 100)
        on(this, retryOutTm)
        return null
      }
      unhover()
      // ensure check if we have a delay open
      if (delay && isTarget) {
        const tm = setTimeout(unhover, delay)
        on(this, tm)
      }
    }

    // this will avoid the delay open if its already open
    const onEnter = () => {
      if (isTarget && this.state.menuHovered) {
        openIfOver()
      } else {
        this.delayOpenIfHover[name]()
      }
    }

    // 🐛 target should close slower than menu opens
    const onLeave = isTarget ? debounce(closeIfOut, 80) : closeIfOut

    // logic for enter/leave
    listeners.push(
      on(this, node, 'mouseenter', () => {
        onEnter()
        // insanity, but mouseleave is horrible
        if (this.props.target) {
          on(this, setTimeout(onLeave, 150))
        }
      }),
    )
    // if noHoverOnChildren it reduces bugs to just not check hovered state
    const onMouseLeave = noHoverOnChildren ? setUnhovered : onLeave
    listeners.push(on(this, node, 'mouseleave', onMouseLeave))
    this.listeners = [...this.listeners, ...listeners]
  }

  // hover helpers
  hoverStateSet(name, isHovered) {
    const { openOnHover, onMouseEnter } = this.props
    const setter = () => {
      const val = isHovered ? Date.now() : 0
      if (name === 'target') {
        this.setState({ targetHovered: val })
      } else {
        this.setState({ menuHovered: val })
      }
    }
    if (isHovered) {
      if (openOnHover) {
        setter()
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
    const childSelector = `${node.tagName.toLowerCase()}.${node.className
      .trim()
      .replace(/\s+/g, '.')}:hover`
    return (
      !!(node.parentNode ? node.parentNode.querySelector(childSelector) : null) ||
      node.querySelector(':hover')
    )
  }

  overlayRef = ref => {
    if (ref) {
      on(this, ref, 'contextmenu', e => this.handleOverlayClick(e))
    }
  }

  handleTargetClick = () => {
    setTimeout(this.stopListeningUntilNextMouseEnter)
  }

  controlledTarget = target => {
    const targetProps = {
      ref: this.targetRef,
      active: false,
      className: `${target.props.className} popover-target`,
    }
    if (this.props.passActive) {
      targetProps.active = this.showPopover
    }
    const { acceptsHovered } = target.type
    if (acceptsHovered) {
      targetProps[acceptsHovered === true ? 'hovered' : acceptsHovered] = this.showPopover
    }
    return (
      <MergeUIContext value={{ hovered: this.showPopover }}>
        {React.cloneElement(target, targetProps)}
      </MergeUIContext>
    )
  }

  closeOthersWithinGroup() {
    if (this.props.group) {
      for (const popover of [...PopoverState.openPopovers]) {
        if (popover === this) {
          continue
        }
        if (popover.props.group === this.props.group) {
          popover.forceClose()
        }
      }
    }
  }

  render() {
    const {
      adjust,
      arrowSize,
      background,
      children,
      closeAnimation,
      closeOnClick,
      closeOnEsc,
      delay,
      distance,
      edgePadding,
      elevation,
      forgiveness,
      height,
      keepOpenOnClickTarget,
      left: _left,
      noArrow,
      noHoverOnChildren,
      onClose,
      onDidOpen,
      open,
      openAnimation,
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
      transition,
      ...props
    } = this.props
    const {
      top,
      left,
      arrowTop,
      arrowLeft,
      // isOpen,
      closing,
      maxHeight,
      direction,
      hasFinishedFirstMeasure,
    } = this.state
    const { showPopover } = this
    const backgroundProp = background === true ? null : { background: `${background}` }
    const isMeasuring = this.state.shouldSetPosition || (top === 0 && left === 0)
    const isOpen = !isMeasuring && showPopover

    console.log('this state', this.state)

    const popoverContent = (
      <PopoverContainer
        data-towards={direction}
        isPositioned={!isMeasuring}
        isOpen={isOpen}
        isClosing={closing}
      >
        {!!overlay && (
          <Overlay
            key={0}
            forwardRef={this.overlayRef}
            isShown={isOpen && !closing}
            onClick={e => this.handleOverlayClick(e)}
            overlay={overlay}
          />
        )}
        <PopoverWrap
          key={1}
          {...popoverProps}
          isOpen={!closing && !!isOpen}
          willReposition={isMeasuring}
          forwardRef={this.setPopoverRef}
          distance={distance}
          forgiveness={forgiveness}
          showForgiveness={showForgiveness}
          animation={openAnimation}
          transition={isMeasuring ? 'none' : transition}
          width={width}
          // because things that extend downwards wont always fill all the way
          // so arrow will be floating, so lets make it always expand fully down
          // when the popover arrow is at bottom
          height={direction === 'top' ? height || maxHeight : height}
          maxHeight={maxHeight}
          left={left}
          top={top}
          style={style}
        >
          {!noArrow && (
            <ArrowContain
              style={{
                top: arrowTop,
                marginLeft: arrowLeft,
                zIndex: 100000000000, // above any shadows
              }}
            >
              <Arrow
                background={
                  typeof background === 'string' && background !== 'transparent' ? background : null
                }
                size={arrowSize}
                towards={INVERSE[direction]}
                boxShadow={getShadow(shadow, elevation)}
              />
            </ArrowContain>
          )}
          <SizedSurface
            sizeRadius
            flex={1}
            ignoreSegment
            hover={false}
            active={false}
            overflow="visible"
            boxShadow={getShadow(shadow, elevation)}
            noInnerElement
            {...props}
            {...backgroundProp}
          >
            {typeof children === 'function'
              ? (children as PopoverChildrenFn)(showPopover)
              : children}
          </SizedSurface>
        </PopoverWrap>
      </PopoverContainer>
    )
    return (
      <>
        {React.isValidElement(target) && this.controlledTarget(target)}
        <Portal>
          <span className="popover-portal" style={{ opacity: hasFinishedFirstMeasure ? 1 : 0 }}>
            {theme ? <Theme name={theme}>{popoverContent}</Theme> : popoverContent}
          </span>
        </Portal>
      </>
    )
  }
}
