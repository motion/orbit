import * as React from 'react'
import { view, on } from '@mcro/black'
import { Portal } from './helpers/portal'
import { isNumber, debounce, throttle, isEqual, omit, Cancelable, last } from 'lodash'
import { Arrow } from './Arrow'
import { SizedSurface } from './SizedSurface'
// import isEqual from 'react-fast-compare'
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

const openPopovers = new Set()

export const PopoverState = {
  openPopovers,
  closeLast: () => {
    last([...openPopovers]).forceClose()
  },
  closeAll: () => {
    ;[...openPopovers].map(x => x.forceClose())
  },
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

// transform: `translateX(${left}px) translateY(${top}px)`,

const PopoverWrap = view({
  position: 'absolute',
  pointerEvents: 'none',
  zIndex: -1,
}).theme(p => {
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
    padding: calcForgiveness(p.forgiveness, p.distance),
    margin: -calcForgiveness(p.forgiveness, p.distance),
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
const calcForgiveness = (forgiveness, distance) => (forgiveness > distance ? distance : forgiveness)

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
  shouldSetPosition: true,
  closing: false,
  maxHeight: null,
  nextPosition: null,
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

  get curProps(): PopoverProps {
    return this.state.props
  }

  target = null
  // TODO: weird unmount/mounted
  unmounted = false
  mounted = false
  targetRef = React.createRef<HTMLDivElement>()
  popoverRef = null

  setPopoverRef = ref => {
    this.popoverRef = ref
  }

  state = initialState

  // curProps is always up to date, so we dont have to thread props around a ton
  // also, nicely lets us define get fn helpers

  static getDerivedStateFromProps(props, state) {
    let nextState: Partial<Popover['state']> = {}
    if (!isEqual(omit(props, ['children']), omit(state.props, ['children']))) {
      nextState = {
        shouldSetPosition: true,
        props,
      }
    }
    if (state.setPosition) {
      nextState.shouldSetPosition = false
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

  componentDidMount() {
    this.mounted = true
    const { openOnClick, closeOnClick, closeOnClickAway, closeOnEsc, open, target } = this.curProps
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

  componentWillUnmount() {
    this.unmounted = true
  }

  get showPopover() {
    return this.props.open || this.state.showPopover
  }

  componentDidUpdate(_prevProps, prevState) {
    if (this.state.nextPosition) {
      this.setState({
        nextPosition: null,
        ...this.state.nextPosition,
      })
      return
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
    if (this.state.shouldSetPosition) {
      this.setPosition()
      this.setOpenOrClosed(this.props)
      this.setState({ shouldSetPosition: false })
    }
    if (this.props.onDidOpen) {
      if (this.showPopover) {
        this.props.onDidOpen()
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
      if (this.curProps.onOpen) {
        this.curProps.onOpen()
      }
    })
  }

  startClosing = () => {
    return new Promise(async resolve => {
      this.setState({ closing: true }, () => {
        if (this.curProps.onClose) {
          this.curProps.onClose()
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
      const { keepOpenOnClickTarget, open, closeOnClick, closeOnClickAway } = this.curProps
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

  isSettingPosition = false

  setPosition() {
    if (!this.popoverRef || this.unmounted) {
      return
    }
    if (this.state.nextPosition) {
      console.log('already setting position for this update...')
      return
    }
    const nextPositionState = this.positionState
    if (nextPositionState.left !== this.state.left || nextPositionState.top !== this.state.top) {
      this.setState({ nextPosition: nextPositionState })
    } else {
      this.setState(nextPositionState)
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

  get targetBounds(): { top: number; left: number; width: number; height: number } | false {
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
    const { top, left } = this.curProps
    return isNumber(top) && isNumber(left)
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
      return null
    }
    if (this.targetBounds === false) {
      return null
    }
    return {
      ...this.positionStateX,
      ...this.positionStateY,
      direction: this.direction,
    }
  }

  get direction(): PopoverDirection {
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

  get positionStateX(): PositionStateX {
    const { direction, popoverSize, targetBounds, forgiveness } = this
    const { alignPopover } = this.props
    if (!targetBounds) {
      return null
    }
    const VERTICAL = direction === 'top' || direction === 'bottom'
    const { adjust, distance, arrowSize } = this.curProps
    // measurements
    const popoverHalfWidth = popoverSize.width / 2
    const arrowCenter = window.innerWidth - popoverHalfWidth
    const targetCenter = targetBounds.left + targetBounds.width / 2

    let popoverAimForCenter = targetCenter
    let left
    let arrowLeft = 0 // defaults to 0

    if (alignPopover === 'left') {
      popoverAimForCenter = targetBounds.left
    }

    // auto for now will just be top/bottom
    // in future it needs to measure target and then determine
    if (VERTICAL) {
      left = this.edgePad(
        popoverAimForCenter - popoverHalfWidth,
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

    // adjust arrow for alignment
    if (alignPopover === 'left') {
      // move it back to the left the amount we move popover right
      arrowLeft += targetCenter - targetBounds.left
    }

    return { arrowLeft, left }
  }

  get positionStateY(): PositionStateY {
    if (!this.targetBounds) {
      return null
    }
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

    const arrowAdjust = distance

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
        maxHeight = window.innerHeight - (targetBounds.top + targetBounds.height)
      }
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
    this.removeListeners()
    this.addHoverListeners('target', this.target)
    // noHoverOnChildren === no hover on the actual popover child element
    if (!this.curProps.noHoverOnChildren) {
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
    const { delay, noHoverOnChildren } = this.curProps
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
        if (this.curProps.target) {
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
    const { openOnHover, onMouseEnter } = this.curProps
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
      nextPosition,
    } = this.state
    const { showPopover } = this
    const backgroundProp = background === true ? null : { background: `${background}` }
    const isMeasuring = this.state.shouldSetPosition || (top === 0 && left === 0)
    const isOpen = !isMeasuring && showPopover
    console.log('isOpen', isOpen, 'showPopover', showPopover)
    const popoverContent = (
      <PopoverContainer
        data-towards={direction}
        isMeasuring={isMeasuring}
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
          isOpen={!nextPosition && !closing && !!isOpen}
          forwardRef={this.setPopoverRef}
          distance={distance}
          forgiveness={forgiveness}
          showForgiveness={showForgiveness}
          animation={openAnimation}
          transition={transition}
          width={width}
          // because things that extend downwards wont always fill all the way
          // so arrow will be floating, so lets make it always expand fully down
          // when the popover arrow is at bottom
          height={direction === 'top' ? height || maxHeight : height}
          maxHeight={maxHeight}
          left={left}
          top={top}
          style={style}
          willReposition={!!nextPosition}
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
          <span className="popover-portal">
            {theme ? <Theme name={theme}>{popoverContent}</Theme> : popoverContent}
          </span>
        </Portal>
      </>
    )
  }
}
