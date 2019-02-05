import { Color } from '@mcro/css'
import { gloss, Theme } from '@mcro/gloss'
import { on } from '@mcro/helpers'
import { Cancelable, debounce, isEqual, isNumber, last, pick } from 'lodash'
import * as React from 'react'
import { findDOMNode } from 'react-dom'
import { Arrow } from './Arrow'
import { MergeUIContext } from './helpers/contexts'
import { getTarget } from './helpers/getTarget'
import { Portal } from './helpers/portal'
import { SizedSurface } from './SizedSurface'
import { getSurfaceShadow, SurfaceProps } from './Surface'

export type PopoverProps = SurfaceProps & {
  // custom theme for just the popover content
  themeName?: string
  // if you set a group, it acts as an ID that makes sure only ONE popover
  // within that ID is ever open
  group?: string
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
  style?: Object
  elevation?: number
  ignoreSegment?: boolean
  onChangeVisibility?: (visibility: boolean) => any
  noPortal?: boolean
  // helps you see forgiveness zone
  showForgiveness?: boolean
}

const defaultProps = {
  edgePadding: 10,
  distance: 14,
  arrowSize: 14,
  forgiveness: 14,
  towards: 'auto',
  openAnimation: 'slide 300ms',
  closeAnimation: 'bounce 300ms',
  adjust: [0, 0],
  delay: 16,
}

type PopoverPropsWithDefaults = PopoverProps & typeof defaultProps

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
  const targetTopReal = targetBounds ? targetBounds.top - window.scrollY : popoverBounds.top

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
    top = getEdgePadding(props, top, window.innerHeight, popoverBounds.height)
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

export type PopoverChildrenFn = ((showPopover: boolean) => React.ReactNode)

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
  shouldSetPosition: false,
  closing: false,
  finishedMount: false,
}

type State = typeof initialState & {
  // TODO make these types real
  targetBounds: any
  popoverBounds: any
  maxHeight: any
}

const isHovered = (props: PopoverProps, state: State) => {
  const { targetHovered, menuHovered } = state
  if (props.noHoverOnChildren) {
    return targetHovered
  }
  return targetHovered || menuHovered
}

const showPopover = (props: PopoverProps, state: State) => {
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

export class Popover extends React.PureComponent<PopoverProps, State> {
  static acceptsHovered = 'open'
  static defaultProps = defaultProps

  targetRef = React.createRef<HTMLDivElement>()
  target: HTMLElement
  popoverRef: HTMLElement
  state = initialState

  static getDerivedStateFromProps(props, state) {
    let nextState: Partial<State> = {}
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

  setPopoverRef = (ref: HTMLElement) => {
    if (ref) {
      this.popoverRef = ref
      const inner = ref.querySelector('.popover-inner-surface')
      this.resizeObserver.observe(inner)
      this.mutationObserver.observe(ref, { attributes: true })
    }
  }

  // @ts-ignore
  resizeObserver = new ResizeObserver((/* ...args */) => {
    // console.log('resize', this.props, args)
    this.setPosition()
  })
  mutationObserver = new MutationObserver((/* ...args */) => {
    // console.log('mutations', this.props, args)
    this.setPosition()
  })

  get domNode() {
    return findDOMNode(this) as HTMLDivElement
  }

  componentDidMount() {
    const { openOnClick, closeOnClick, closeOnClickAway, closeOnEsc, open, target } = this.props

    this.resizeObserver.observe(document.documentElement)

    if (openOnClick || closeOnClick || closeOnClickAway) {
      this.listenForClickAway()
    }
    if (open) {
      this.open()
    }

    const isManuallyPositioned = getIsManuallyPositioned(this.props)

    // allow multiple flexible ways to pass in targets
    if (typeof target === 'string') {
      this.target = getTarget(target)
    } else {
      const target = this.domNode.classList.contains('popover-target')
      if (target) {
        this.target = this.domNode
      } else {
        if (!isManuallyPositioned) {
          // potentially we can just get it directly
          throw new Error('Couldnt pass className down to target to do measurements...')
        }
      }
    }

    if (!isManuallyPositioned && !this.target) {
      throw new Error('Not manually positioned and no target found.')
    }

    if (isManuallyPositioned) {
      // fix flickering on initial mount of popovers...
      this.setState({ finishedMount: true })
    }

    if (this.target) {
      this.setPosition()
      this.listenForClick()
      this.listenForHover()
      on(this, this.target, 'click', this.handleTargetClick)
      if (closeOnEsc) {
        const parentNode = this.domNode.parentNode as HTMLDivElement
        const parentPortalNode = parentNode.querySelector('.popover-portal') as HTMLDivElement
        on(this, parentPortalNode, 'keyup', e => {
          if (e.keyCode === 27) {
            e.preventDefault()
            e.stopPropagation()
            this.forceClose()
          }
        })
      }

      // handling flickers poorly, TODO investigate why portals cause it to never hide on initial mount
      setTimeout(() => {
        if (!this.unmounted) {
          this.setState({ finishedMount: true })
        }
      }, 500)
    }
  }

  unmounted = false

  componentWillUnmount() {
    PopoverState.openPopovers.delete(this)
    this.unmounted = true
    this.mutationObserver.disconnect()
    this.resizeObserver.disconnect()
  }

  get showPopover() {
    if (typeof this.props.open === 'boolean') {
      return this.props.open
    }
    return this.state.showPopover
  }

  componentDidUpdate(_prevProps, prevState) {
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

  setPosition = debounce(() => {
    if (this.unmounted) {
      return
    }
    if (getIsManuallyPositioned(this.props)) {
      return
    }
    if (!this.popoverRef || !this.target) {
      throw new Error('missing popvoer ref or target')
    }
    // get popover first child which is the inner div that doesn't deal with forgiveness padding
    const popoverBounds = this.popoverRef.children[0].getBoundingClientRect()
    const nextState = {
      targetBounds: JSON.parse(JSON.stringify(this.target.getBoundingClientRect())),
      popoverBounds: {
        left: popoverBounds.left,
        width: popoverBounds.width,
        height: popoverBounds.height,
      },
    }
    // if changed, update
    const prevState = pick(this.state, Object.keys(nextState))
    if (!isEqual(nextState, prevState)) {
      this.setState({
        ...nextState,
        shouldSetPosition: true,
      })
    }
  }, 64)

  forceClose = async () => {
    this.stopListeningUntilNextMouseEnter()
    await this.startClosing()
    this.setState({ closing: false, isPinnedOpen: 0, showPopover: false })
  }

  toggleOpen = () => {
    if (this.showPopover) {
      this.forceClose()
    } else {
      this.open()
    }
  }

  open = () => {
    this.setState({ showPopover: true }, () => {
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

  addHoverListeners(name: string, node: HTMLElement) {
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

  get isMeasuring() {
    return this.state.shouldSetPosition || !this.state.finishedMount
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
      noPortal,
      themeName,
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
    const backgroundProp =
      !background || background === true ? null : { background: `${background}` }
    const isOpen = !isMeasuring && showPopover

    const popoverContent = (
      <PopoverContainer
        data-towards={direction}
        isPositioned={!isMeasuring}
        isOpen={isOpen}
        isClosing={closing}
        noHoverOnChildren={noHoverOnChildren}
      >
        {!!overlay && (
          <Overlay
            key={0}
            ref={this.overlayRef}
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
          ref={this.setPopoverRef}
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
          noHoverOnChildren={noHoverOnChildren}
        >
          <PopoverInner>
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
                    typeof background === 'string' && background !== 'transparent'
                      ? background
                      : null
                  }
                  size={arrowSize}
                  towards={INVERSE[direction]}
                  boxShadow={getSurfaceShadow(elevation)}
                />
              </ArrowContain>
            )}
            <SizedSurface
              className="popover-inner-surface"
              sizeRadius
              flex={1}
              ignoreSegment
              hover={false}
              active={false}
              overflow="hidden"
              elevation={elevation}
              noInnerElement
              {...restProps}
              {...backgroundProp}
            >
              {typeof children === 'function'
                ? (children as PopoverChildrenFn)(showPopover)
                : children}
            </SizedSurface>
          </PopoverInner>
        </PopoverWrap>
      </PopoverContainer>
    )

    const popoverChildren = <Theme name={themeName}>{popoverContent}</Theme>

    if (noPortal) {
      return popoverChildren
    }

    return (
      <>
        {React.isValidElement(target) && this.controlledTarget(target)}
        <Portal>
          <span className="popover-portal" style={{ opacity: isMeasuring ? 0 : 1 }}>
            {popoverChildren}
          </span>
        </Portal>
      </>
    )
  }
}

const PopoverContainer = gloss({
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
  isClosing: {
    zIndex: 5000 - 1,
  },
  isMeasuring: {
    opacity: 0,
  },
}).theme(({ isOpen, noHoverOnChildren }) =>
  isOpen
    ? {
        zIndex: 5000,
        '& > *': {
          pointerEvents: noHoverOnChildren ? 'none' : 'all !important',
        },
      }
    : null,
)

const Overlay = gloss({
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

const PopoverWrap = gloss({
  position: 'absolute',
  pointerEvents: 'none',
  zIndex: -1,
}).theme(p => {
  let pointerEvents = p.noHoverOnChildren ? 'none' : p.pointerEvents || 'none'
  if (p.isOpen && !p.noHoverOnChildren) {
    pointerEvents = p.noPortal ? 'inherit' : 'auto'
  }
  return {
    width: p.width,
    height: p.height,
    maxHeight: p.maxHeight,
    transition: p.willReposition
      ? 'none'
      : p.transition || 'opacity ease-in 60ms, transform ease-out 100ms',
    opacity: p.isOpen && !p.willReposition ? 1 : 0,
    pointerEvents,
    transform: {
      x: p.left,
      y: (p.isOpen && !p.willReposition ? 0 : -5) + p.top,
    },
    padding: p.forgiveness,
    margin: -p.forgiveness,
    background: p.showForgiveness ? [250, 250, 0, 0.2] : 'auto',
    animation: p.animation,
  }
})

const PopoverInner = gloss({
  flex: 1,
  position: 'relative',
})

const ArrowContain = gloss({
  position: 'absolute',
  left: '50%',
})
