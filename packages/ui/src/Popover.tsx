import { ColorLike } from '@o/color'
import { isEqual } from '@o/fast-compare'
import { on } from '@o/utils'
import { Box, gloss, Theme, ThemeContext } from 'gloss'
import { Cancelable, debounce, isNumber, last, pick } from 'lodash'
import * as React from 'react'
import { animated, AnimatedProps } from 'react-spring'

import { Arrow } from './Arrow'
import { BreadcrumbReset } from './Breadcrumbs'
import { zIndex } from './constants'
import { getTarget } from './helpers/getTarget'
import { Portal } from './helpers/portal'
import { SizedSurface, SizedSurfaceProps } from './SizedSurface'
import { SurfacePassPropsReset } from './Surface'
import { getElevation } from './View/elevation'
import { View } from './View/View'

const acceptsProps = (x, val) => x.type.acceptsProps && x.type.acceptsProps[val]

type AnimatedDivProps = AnimatedProps<React.HTMLAttributes<HTMLDivElement>>

export type PopoverProps = Omit<SizedSurfaceProps, 'background' | 'style'> & {
  /** Custom theme for just the popover content */
  popoverTheme?: string

  /** If you set a group, it acts as an ID that makes sure only one popover within that ID is ever open */
  group?: string

  /** Can pass function to get isOpen passed in */
  children?: React.ReactNode | PopoverChildrenFn

  /** Element or function that returns element, or querySelector to element */
  target?: React.ReactNode | (() => React.ReactNode) | string
  open?: boolean

  /** The amount of space around popover you can move mouse */

  /** Before it triggers it to close */
  forgiveness?: number

  /** Show a background over content */
  overlay?: boolean
  left?: number
  top?: number

  /** The distance the popover is from the target */
  distance?: number

  /** Open when target is clicked */
  openOnClick?: boolean

  /** Open automatically when target is hovered */
  openOnHover?: boolean

  /** Delay until openOnHover */
  delay?: number

  /** Prevent popover itself from catching pointer events */
  noHoverOnChildren?: boolean

  /** Size of shown arrow */
  arrowSize?: number

  /** Close when you click outside it */
  closeOnClickAway?: boolean

  /** Close when you click inside it */
  closeOnClick?: boolean
  closeOnEsc?: boolean

  /** Callback when hover event happens, even if controlled */
  onHover?: (isHovered: boolean) => any

  /** Which direction it shows towards */

  /** Default determine direction automatically */
  towards?: PopoverDirection

  /** Popover can aim to be centered or left aligned on the target */
  alignPopover?: 'left' | 'center'
  padding?: number[] | number
  onClose?: Function
  openAnimation?: string
  closeAnimation?: string

  /** Lets you adjust position after target is positioned */
  adjust?: number[]

  /** Hide arrow */
  noArrow?: boolean

  /** Padding from edge of window */
  edgePadding?: number

  /** Pretty much what it says, for use with closeOnClick */
  keepOpenOnClickTarget?: boolean

  /** Callback after close */
  onDidClose?: Function

  /** Callback after open */
  onDidOpen?: Function
  onOpen?: Function
  height?: number
  width?: number
  background?: true | ColorLike
  passActive?: boolean
  popoverProps?: Object
  elevation?: number
  ignoreSegment?: boolean
  onChangeVisibility?: (visibility: boolean) => any
  noPortal?: boolean

  /** Helps you see forgiveness zone */
  showForgiveness?: boolean

  /** Get ref to the Popover class */
  popoverRef?: Function

  /** Get ref to the popover element */
  nodeRef?: Function

  /** Portal styling */
  portalStyle?: Object

  /** Allows spring animations passed into style */
  style?: AnimatedDivProps['style']
}

const defaultProps = {
  edgePadding: 10,
  distance: 14,
  arrowSize: 14,
  forgiveness: 14,
  towards: 'auto',
  transition: 'all ease 100ms',
  openAnimation: 'slide 300ms',
  closeAnimation: 'bounce 300ms',
  adjust: [0, 0],
  delay: 16,
  group: 'global',
  zIndex: zIndex.Popover,
}

type PopoverPropsWithDefaults = PopoverProps & typeof defaultProps

type DebouncedFn = Function & Cancelable
type PopoverDirection = 'top' | 'bottom' | 'left' | 'right' | 'auto'
type PositionStateX = { arrowLeft: number; left: number }
type PositionStateY = { arrowTop: number; top: number; maxHeight: number }
type Bounds = { top: number; left: number; width: number; height: number }

class PopoverManager {
  state = new Set<Popover>()
  closeTm = {}
  closeGroup(group: string, ignore: any) {
    this.state.forEach(item => {
      if (item === ignore) return
      if (item.props.group === group) {
        item.forceClose({ animate: false })
      }
    })
  }
  closeLast() {
    last([...this.state]).forceClose({ animate: false })
  }
  closeAll() {
    this.state.forEach(x => x.forceClose({ animate: false }))
  }
}

export const Popovers = new PopoverManager()

const getIsManuallyPositioned = ({ top, left }: { top?: number; left?: number }) => {
  return isNumber(top) && isNumber(left)
}

const getPositionState = (
  props: PopoverPropsWithDefaults,
  popoverBounds: Bounds,
  targetBounds?: Bounds,
) => {
  const direction = getDirection(props, popoverBounds, targetBounds)
  return {
    ...positionStateX(props, popoverBounds, direction, targetBounds),
    ...positionStateY(props, popoverBounds, direction, targetBounds),
    direction,
  }
}

const getDirection = (
  props: PopoverPropsWithDefaults,
  popoverBounds: Bounds,
  targetBounds?: Bounds,
): PopoverDirection => {
  if (!targetBounds || props.towards !== 'auto') {
    return props.towards || 'top'
  }
  const popoverY = popoverBounds.height + props.forgiveness
  const targetY = targetBounds.top + targetBounds.height
  const towardsTop = targetY + popoverY > window.innerHeight
  return towardsTop ? 'top' : 'bottom'
}

const getEdgePadding = (
  props: PopoverPropsWithDefaults,
  currentPosition: number,
  windowSize: number,
  popoverBounds: number,
) => {
  return Math.min(
    // upper limit
    windowSize - props.edgePadding - popoverBounds,
    // lower limit
    Math.max(props.edgePadding, currentPosition),
  )
}

const positionStateY = (
  props: PopoverPropsWithDefaults,
  popoverBounds: Bounds,
  direction: PopoverDirection,
  targetBounds?: Bounds,
): PositionStateY => {
  const { distance, adjust, noArrow, arrowSize } = props
  const VERTICAL = direction === 'top' || direction === 'bottom'

  // since its rotated 45deg, the real height is less 1/4 of set height
  const arrowHeight = noArrow ? 0 : arrowSize * 0.75
  const targetCenter = targetBounds
    ? targetBounds.top + targetBounds.height / 2
    : popoverBounds.height / 2
  const targetTopReal = targetBounds ? targetBounds.top : popoverBounds.top

  let arrowTop = 0
  let maxHeight = window.innerHeight
  let top = 0

  const arrowAdjust = distance

  // bottom half
  if (VERTICAL) {
    // determine arrow location
    if (direction === 'top') {
      arrowTop = popoverBounds.height + arrowAdjust
      top = targetTopReal - popoverBounds.height - distance
    } else {
      arrowTop = -arrowSize
      top = targetTopReal + (targetBounds ? targetBounds.height : 0) + distance
    }

    // final top
    top = getEdgePadding(props, top, window.innerHeight + window.scrollY, popoverBounds.height)
  } else {
    // HORIZONTAL
    const popoverCenter = popoverBounds.height / 2
    top = targetCenter - popoverCenter
    arrowTop = targetCenter - top + arrowHeight / 2
  }

  // adjustments
  top += adjust[1]
  arrowTop -= adjust[1]

  // max height
  if (VERTICAL) {
    if (direction === 'top') {
      maxHeight = (targetBounds ? targetBounds.top : 0) - top + props.distance * 2 - arrowSize / 2
    } else {
      // HORIZONTAL
      maxHeight = window.innerHeight - (targetBounds ? targetBounds.top + targetBounds.height : 0)
    }
  }

  return { arrowTop: Math.round(arrowTop), top: Math.round(top), maxHeight }
}

const positionStateX = (
  props: PopoverPropsWithDefaults,
  popoverBounds: Bounds,
  direction: PopoverDirection,
  targetBounds?: Bounds,
): PositionStateX => {
  const { arrowSize } = props
  let targetCenter: number

  if (getIsManuallyPositioned(props)) {
    targetCenter = props.left + props.width / 2
    popoverBounds = { width: props.width, height: props.height, top: 0, left: 0 }
  } else {
    targetCenter = targetBounds
      ? targetBounds.left + targetBounds.width / 2
      : popoverBounds.width / 2 + popoverBounds.left
  }

  const popoverHalfWidth = popoverBounds.width / 2
  let left = 0
  let arrowLeft = 0

  // if (props.alignPopover === 'left') {
  //   popoverCenter = targetBounds ? targetBounds.left : popoverBounds.left
  // }

  switch (direction) {
    case 'top':
    case 'bottom':
      const naturalLeft = targetCenter - popoverHalfWidth
      left = getEdgePadding(props, naturalLeft, window.innerWidth, popoverBounds.width)
      const popoverCenter = left + popoverHalfWidth

      // when near edges, adjust for the misaligned centers
      if (targetCenter !== popoverCenter) {
        arrowLeft = targetCenter - popoverCenter
      }

      // center width of arrow
      arrowLeft -= arrowSize / 2

      // arrowLeft bounds
      // const popoverMaxX = popoverBounds.width + popoverBounds.left
      // const max = Math.max(arrowSize + props.edgePadding, popoverMaxX - arrowSize)
      // const min = popoverBounds.left + arrowSize
      // arrowLeft = Math.max(min, Math.min(max, arrowLeft))

      break
    case 'left':
      left = (targetBounds ? targetBounds.left : 0) - popoverBounds.width - props.distance
      break
    case 'right':
      left = (targetBounds ? targetBounds.left + targetBounds.width : 0) + props.distance
      arrowLeft = -popoverHalfWidth - arrowSize
      break
  }

  // adjustments
  left += props.adjust[0]
  arrowLeft -= props.adjust[0]

  // adjust arrow for alignment
  if (props.alignPopover === 'left') {
    // move it back to the left the amount we move popover right
    arrowLeft += targetCenter - (targetBounds ? targetBounds.left : 0)
  }

  return { arrowLeft: Math.round(arrowLeft), left: Math.round(left) }
}

export type PopoverChildrenFn = (showPopover: boolean) => React.ReactNode

const INVERSE = {
  top: 'bottom',
  bottom: 'top',
  left: 'right',
  right: 'left',
}

const initialState = {
  maxHeight: null,
  targetBounds: null,
  popoverBounds: null,
  showPopover: false,
  targetHovered: 0,
  menuHovered: 0,
  top: 0,
  left: 0,
  arrowTop: 0,
  arrowLeft: 0,
  arrowInnerTop: 0,
  isPinnedOpen: 0,
  direction: 'auto' as PopoverDirection,
  delay: 16,
  props: {} as PopoverProps,
  closing: false,
  measureState: 'done' as 'done' | 'shouldMeasure',
}

type PopoverState = typeof initialState & {
  // TODO make these types real
  targetBounds: any
  popoverBounds: any
  maxHeight: any
}

const isHovered = (props: PopoverProps, state: PopoverState) => {
  const { targetHovered, menuHovered } = state
  if (props.noHoverOnChildren) {
    return targetHovered
  }
  return targetHovered || menuHovered
}

const shouldShowPopover = (props: PopoverProps, state: PopoverState) => {
  const { isPinnedOpen } = state
  const { openOnHover, open } = props
  if (open || isPinnedOpen) {
    return true
  }
  if (typeof open === 'undefined') {
    return !!(openOnHover && isHovered(props, state))
  }
  return false
}

export class Popover extends React.Component<PopoverProps, PopoverState> {
  static defaultProps = defaultProps
  static contextType = ThemeContext

  targetRef = React.createRef<HTMLDivElement>()
  popoverRef: HTMLElement
  state = initialState

  get target() {
    return this.targetRef.current
  }

  static getDerivedStateFromProps(props: PopoverPropsWithDefaults, state: PopoverState) {
    let nextState: Partial<PopoverState> = {}
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
    }

    const nextShow = shouldShowPopover(props, state)
    if (nextShow !== state.showPopover) {
      if (nextShow) {
        nextState.measureState = 'shouldMeasure'
      } else {
        nextState.showPopover = false
      }
    }

    if (!Object.keys(nextState).length) {
      return null
    }

    return nextState
  }

  setPopoverRef = (ref: HTMLElement) => {
    if (ref) {
      this.popoverRef = ref
      if (this.props.nodeRef) {
        this.props.nodeRef(ref)
      }
    }
  }

  componentDidMount() {
    const {
      openOnClick,
      closeOnClick,
      closeOnClickAway,
      closeOnEsc,
      open,
      target,
      popoverRef,
    } = this.props

    if (popoverRef) {
      popoverRef(this)
    }

    if (openOnClick || closeOnClick || closeOnClickAway) {
      this.listenForClickAway()
    }
    if (open) {
      this.open()
    }

    const isManuallyPositioned = getIsManuallyPositioned(this.props)

    // allow multiple ways to pass in targets
    if (typeof target === 'string') {
      // selector
      // @ts-ignore
      this.targetRef['current'] = getTarget(target)
    } else {
      if (!this.target && !isManuallyPositioned) {
        // potentially we can just get it directly
        throw new Error('Couldnt pass className down to target to do measurements...')
      }
    }

    if (!isManuallyPositioned && !this.target) {
      throw new Error('Not manually positioned and no target found.')
    }

    if (this.target) {
      this.listenForClick()
      this.listenForHover()
      on(this, this.target, 'click', this.handleTargetClick)
      if (closeOnEsc) {
        const parentNode = this.target.parentElement.parentElement
        const parentPortalNode =
          (parentNode.querySelector('.popover-portal') as HTMLDivElement) ||
          parentNode.firstElementChild
        on(this, parentPortalNode, 'keyup', e => {
          if (e.keyCode === 27) {
            e.preventDefault()
            e.stopPropagation()
            this.forceClose()
          }
        })
      }
    }

    this.updateMeasure()
  }

  unmounted = false

  componentWillUnmount() {
    Popovers.state.delete(this)
    this.unmounted = true
  }

  componentDidUpdate(_prevProps, prevState) {
    if (!this.showPopover) {
      Popovers.state.delete(this)
    }
    this.updateMeasure()
    if (this.props.onChangeVisibility) {
      if (prevState.showPopover !== this.state.showPopover) {
        this.props.onChangeVisibility(this.state.showPopover)
      }
    }
    if (this.props.onDidOpen) {
      if (this.showPopover) {
        this.props.onDidOpen()
      }
    }
    // unhovered
    if (this.props.onHover) {
      if (
        (prevState.targetHovered || prevState.menuHovered) &&
        (!this.state.targetHovered && !this.state.menuHovered)
      ) {
        this.props.onHover(false)
      }
      if (
        !prevState.targetHovered &&
        !prevState.menuHovered &&
        (this.state.targetHovered || this.state.menuHovered)
      ) {
        this.props.onHover(true)
      }
    }
  }

  // make sure you do it through here
  setShowPopover = (state: Partial<PopoverState>, cb?: any) => {
    this.closeOthersWithinGroup()
    this.addToOpenPopoversList()
    this.setState({ ...state, showPopover: true } as any, cb)
  }

  addToOpenPopoversList() {
    if (typeof this.props.open === 'undefined') {
      Popovers.state.add(this)
    }
  }

  updateMeasure() {
    if (this.state.measureState === 'shouldMeasure') {
      this.setPosition(this.setShowPopover)
    }
  }

  setPosition = afterMeasure => {
    const { props } = this
    if (this.unmounted) return
    if (getIsManuallyPositioned(props)) return
    if (!this.popoverRef || !this.target) {
      throw new Error('missing popvoer ref or target')
    }

    // get popover first child which is the inner div that doesn't deal with forgiveness padding
    const popoverBounds = this.popoverRef.firstElementChild.getBoundingClientRect()
    const targetNode = this.target.firstElementChild || this.target
    const targetBounds = targetNode.getBoundingClientRect()
    const extraY = window.scrollY
    const nextState = {
      targetBounds: {
        top: targetBounds.top + extraY,
        left: targetBounds.left,
        width: targetBounds.width,
        height: targetBounds.height,
      },
      popoverBounds: {
        top: popoverBounds.top + extraY,
        left: popoverBounds.left,
        width: Math.min(window.innerWidth, popoverBounds.width),
        height: Math.min(window.innerHeight, popoverBounds.height),
      },
    }

    // if changed, update
    const prevState = pick(this.state, Object.keys(nextState))
    if (!isEqual(nextState, prevState)) {
      const nextPosition = getPositionState(
        props as PopoverPropsWithDefaults,
        nextState.popoverBounds,
        nextState.targetBounds,
      )

      this.setState({
        ...nextState,
        measureState: 'done',
        ...nextPosition,
      })
    } else {
      this.setState(
        {
          measureState: 'done',
        },
        afterMeasure,
      )
    }
  }

  forceClose = async ({ animate = true } = {}) => {
    // clear any pending hovers that will eventually open a competing menu
    this.cancelIfWillOpen()
    this.stopListeningUntilNextMouseEnter()
    if (animate) {
      await this.startClosing()
    }
    this.setState({
      closing: false,
      isPinnedOpen: 0,
      showPopover: false,
      measureState: 'done',
    })
  }

  toggleOpen = () => {
    if (this.showPopover) {
      this.forceClose()
    } else {
      this.open()
    }
  }

  open = () => {
    this.setShowPopover(null, () => {
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
    this.setState({ closing: false, showPopover: false })
    if (this.props.onDidClose) {
      this.props.onDidClose()
    }
  }

  targetClickOff: any = null

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
    this.targetClickOff = on(this, this.target, 'click', this.handleClickOpen)
  }

  handleClickOpen = e => {
    this.closeOthersWithinGroup()
    e.stopPropagation()
    if (this.state.isPinnedOpen) {
      if (this.state.targetHovered && this.props.openOnHover) {
        // avoid closing when clicking while hovering + openOnHover
        return
      }
      this.forceClose()
    } else {
      this.setState({ isPinnedOpen: Date.now() })
    }
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
    if (this.unmounted) {
      return
    }
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

  listeners: any[] = []

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
      if (typeof listener === 'function') {
        listener()
      }
    }
    this.listeners = []
  }

  delayOpenIfHover: { [key: string]: DebouncedFn | null } = {
    target: null,
    menu: null,
  }

  private cancelIfWillOpen() {
    for (const key in this.delayOpenIfHover) {
      const fn = this.delayOpenIfHover[key]
      if (fn && fn.cancel) {
        fn.cancel()
      }
    }
  }

  addHoverListeners(name: 'target' | 'menu', node: HTMLElement) {
    if (!(node instanceof HTMLElement)) {
      console.log('no node!', name)
      return null
    }
    // because debouncing things is dangerous, lets track last event
    // and use it as source of truth for "is hovered or isnt"
    let lastEvent: 'enter' | 'leave' = 'leave'
    const listeners = []
    const { delay, noHoverOnChildren } = this.props
    const isPopover = name === 'menu'
    const isTarget = name === 'target'
    const setHovered = () => {
      if (lastEvent === 'enter') this.hoverStateSet(name, true)
    }
    const setUnhovered = () => {
      if (lastEvent === 'leave') this.hoverStateSet(name, false)
    }
    const openIfOver = () => {
      if (this.isNodeHovered(node)) {
        setHovered()
      }
    }

    this.cancelIfWillOpen()
    this.delayOpenIfHover[name] = debounce(openIfOver, isTarget ? delay : 0)
    let retryOutTm: any = null

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
        this.addToOpenPopoversList() // so we cancel pending hovers too
        this.delayOpenIfHover[name]()
      }
    }

    // 🐛 target should close slower than menu opens
    const onLeave = isTarget ? debounce(closeIfOut, 80) : closeIfOut

    // logic for enter/leave
    listeners.push(
      on(this, node, 'mouseenter', () => {
        lastEvent = 'enter'
        onEnter()
        // insanity, but mouseleave is horrible
        if (this.props.target) {
          on(this, setTimeout(onLeave, 150))
        }
      }),
    )
    // if noHoverOnChildren it reduces bugs to just not check hovered state
    const onMouseLeave = noHoverOnChildren ? setUnhovered : onLeave
    listeners.push(
      on(this, node, 'mouseleave', () => {
        lastEvent = 'leave'
        onMouseLeave()
      }),
    )
    this.listeners = [...this.listeners, ...listeners]
  }

  // hover helpers
  hoverStateSet(name: string, next: boolean) {
    const { openOnHover } = this.props
    const setter = () => {
      const val = next ? Date.now() : 0
      if (name === 'target') {
        this.setState({ targetHovered: val })
      } else {
        this.setState({ menuHovered: val })
      }
    }
    if (next) {
      if (openOnHover) {
        setter()
      }
    } else {
      if (openOnHover) {
        setter()
      }
    }
    return next
  }

  isNodeHovered = (node: HTMLElement) => {
    const childSelector = `${node.tagName.toLowerCase()}.${node.className
      .trim()
      .replace(/\s+/g, '.')}:hover`

    const parentNode = node.parentNode as HTMLDivElement

    if (parentNode) {
      const hoverChild = parentNode.querySelector(childSelector)
      if (hoverChild) {
        return hoverChild
      }
    }

    return node.querySelector(':hover')
  }

  overlayRef = ref => {
    if (ref) {
      on(this, ref, 'contextmenu', e => this.handleOverlayClick(e))
    }
  }

  handleTargetClick = () => {
    // settimeout so it captures once the action completes
    setTimeout(() => {
      if (!this.unmounted) {
        this.stopListeningUntilNextMouseEnter()
      }
    }, 0)
  }

  controlledTarget = target => {
    if (!target) {
      return null
    }
    const targetProps = {
      active: undefined,
      className: `${target.props['className'] || ''} popover-target`,
      nodeRef: this.targetRef,
      // ref: this.targetRef,
    }
    if (this.props.passActive) {
      targetProps.active = this.showPopover
    }
    const acceptsHovered = acceptsProps(target, 'hover')
    if (acceptsHovered) {
      targetProps[acceptsHovered === true ? 'hover' : acceptsHovered] = this.showPopover
    }
    return React.cloneElement(target, targetProps)
  }

  closeOthersWithinGroup() {
    Popovers.closeGroup(this.props.group, this)
  }

  get isMeasuring() {
    return this.state.measureState !== 'done'
  }

  get showPopover() {
    if (this.isMeasuring) {
      return false
    }
    if (typeof this.props.open === 'boolean') {
      return this.props.open
    }
    return this.state.showPopover
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
      showForgiveness,
      style,
      target,
      theme,
      top: _top,
      towards,
      width,
      transition,
      noPortal,
      popoverTheme,
      zIndex,
      transform,
      portalStyle,
      ...restProps
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
    } = this.state
    const { isMeasuring, showPopover } = this
    const backgroundProp = !background
      ? null
      : { background: background === true ? themeBg : background }
    const hasMeasuredOnce = !!this.state.popoverBounds

    let popoverContent = (
      <PopoverContainer
        data-towards={direction}
        isOpen={showPopover}
        isTouchable={!noHoverOnChildren && showPopover}
        style={style}
      >
        {!!overlay && (
          <Overlay
            nodeRef={this.overlayRef}
            isShown={showPopover && !closing}
            onClick={e => this.handleOverlayClick(e)}
            overlay={overlay}
          />
        )}
        <PopoverWrap
          {...popoverProps}
          nodeRef={this.setPopoverRef}
          distance={distance}
          forgiveness={forgiveness}
          showForgiveness={showForgiveness}
          isOpen={!closing && showPopover}
          // animation={!isMeasuring && openAnimation}
          willReposition={isMeasuring}
          transition={isMeasuring ? 'none' : transition}
          width={width}
          // because things that extend downwards wont always fill all the way
          // so arrow will be floating, so lets make it always expand fully down
          // when the popover arrow is at bottom
          height={direction === 'top' ? height || maxHeight : height}
          maxHeight={maxHeight}
          left={left}
          top={top}
          noHoverOnChildren={noHoverOnChildren}
        >
          <PopoverInner transform={transform}>
            {!noArrow && (
              <ArrowContain
                style={{
                  top: arrowTop,
                  marginLeft: arrowLeft,
                  zIndex: 100000000000, // above any shadows
                }}
              >
                <Arrow
                  {...backgroundProp}
                  size={arrowSize}
                  towards={INVERSE[direction]}
                  // TODO this is bad because were allowing setting theme from the property...
                  // so this wont get the theme set through the property, we should remove the property
                  {...getElevation({ elevation }, this.context.activeTheme)}
                />
              </ArrowContain>
            )}
            <BreadcrumbReset>
              <SurfacePassPropsReset>
                <SizedSurface
                  className="popover-inner-surface"
                  subTheme="popover"
                  sizeRadius
                  flex={1}
                  hoverStyle={null}
                  activeStyle={null}
                  overflow="hidden"
                  elevation={elevation}
                  noInnerElement
                  opacity={1}
                  {...restProps}
                  {...backgroundProp}
                >
                  {typeof children === 'function'
                    ? (children as PopoverChildrenFn)(showPopover)
                    : children}
                </SizedSurface>
              </SurfacePassPropsReset>
            </BreadcrumbReset>
          </PopoverInner>
        </PopoverWrap>
      </PopoverContainer>
    )

    if (popoverTheme) {
      popoverContent = <Theme theme={popoverTheme}>{popoverContent}</Theme>
    }

    if (noPortal) {
      return (
        <>
          {React.isValidElement(target) && this.controlledTarget(target)}
          {popoverContent}
        </>
      )
    }

    return (
      <>
        {React.isValidElement(target) && this.controlledTarget(target)}
        <Portal className="ui-popover" style={{ zIndex, position: 'fixed', ...portalStyle }}>
          <span
            className="popover-portal"
            style={{
              opacity: isMeasuring ? 0 : 1,
              display: hasMeasuredOnce ? 'inherit' : 'none',
            }}
          >
            {popoverContent}
          </span>
        </Portal>
      </>
    )
  }
}

const themeBg = theme => theme.background

const PopoverContainer = gloss<AnimatedDivProps & { isOpen?: boolean; isTouchable?: boolean }>(
  animated.div,
  {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 5000,
    pointerEvents: 'none',
    '& > *': {
      pointerEvents: 'none !important',
    },
    isOpen: {
      opacity: 1,
    },
    isTouchable: {
      '& > *': {
        pointerEvents: 'all !important',
      },
    },
  },
).withConfig({
  ignoreAttrs: {
    isOpen: true,
    isTouchable: true,
  },
})

const Overlay = gloss<any>(Box, {
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

const PopoverWrap = gloss<any>(Box, {
  position: 'absolute',
  pointerEvents: 'none',
  zIndex: -1,
}).theme(p => {
  let pointerEvents = p.noHoverOnChildren ? 'none' : p.pointerEvents || 'none'
  if (p.isOpen && !p.noHoverOnChildren) {
    pointerEvents = p.noPortal ? 'inherit' : 'auto'
  }
  const transform = {
    x: p.left,
    y: (p.isOpen && !p.willReposition ? 0 : -5) + p.top,
  }
  return {
    width: p.width,
    height: p.height,
    maxHeight: p.maxHeight,
    transition: p.willReposition ? 'none' : p.transition,
    opacity: p.isOpen && !p.willReposition ? 1 : 0,
    pointerEvents,
    transform,
    padding: p.forgiveness,
    margin: -p.forgiveness,
    background: p.showForgiveness ? [250, 250, 0, 0.2] : 'auto',
  }
})

const PopoverInner = gloss(View, {
  flex: 1,
  position: 'relative',
})

const ArrowContain = gloss({
  position: 'absolute',
  left: '50%',
})
