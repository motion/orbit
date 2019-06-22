import { cloneElement, Component } from 'react'
import { findDOMNode } from 'react-dom'
import { Direction } from 'react-window'
import ResizeObserver from 'resize-observer-polyfill'

import { VisibilityContext } from '../Visibility'

type ItemMeasurerProps = {
  direction: Direction
  layout: any
  handleNewMeasurements: any
  index: number
  item: React.ReactElement<any>
  size: number
}

let findDOMNodeWarningsSet = new Set()

if (process.env.NODE_ENV !== 'production') {
  findDOMNodeWarningsSet = new Set()
}

export class ItemMeasurer extends Component<ItemMeasurerProps, void> {
  _didProvideValidRef: boolean = false
  _node: HTMLElement | null = null
  _resizeObserver: ResizeObserver | null = null

  static contextType = VisibilityContext

  componentDidMount() {
    if (process.env.NODE_ENV !== 'production') {
      if (!this._didProvideValidRef) {
        const { item } = this.props

        const displayName =
          item && item.type
            ? item.type['displayName'] || item.type['name'] || '(unknown)'
            : '(unknown)'

        if (!findDOMNodeWarningsSet.has(displayName)) {
          findDOMNodeWarningsSet.add(displayName)

          console.warn(
            'DynamicSizeList item renderers should attach a ref to the topmost HTMLElement they render. ' +
              `The item renderer "${displayName}" did not attach a ref to a valid HTMLElement. ` +
              'findDOMNode() will be used as a fallback, but is slower and more error prone than using a ref.\n\n' +
              'Learn more about ref forwarding: ' +
              'https://reactjs.org/docs/forwarding-refs.html#forwarding-refs-to-dom-components',
          )
        }
      }
    }

    // Force sync measure for the initial mount.
    // This is necessary to support the DynamicSizeList layout logic.
    this._measureItem(true)

    if (typeof ResizeObserver !== 'undefined') {
      // Watch for resizes due to changed content,
      // Or changes in the size of the parent container.
      this._resizeObserver = new ResizeObserver(this._onResize)
      if (this._node !== null) {
        this._resizeObserver.observe(this._node)
      }
    }
  }

  componentWillUnmount() {
    if (this._resizeObserver !== null) {
      this._resizeObserver.disconnect()
      this._resizeObserver = null
    }
  }

  render() {
    return cloneElement(this.props.item, {
      ref: this._refSetter,
    })
  }

  _measureItem = (isCommitPhase: boolean) => {
    const { direction, layout, handleNewMeasurements, index, size: oldSize } = this.props

    const node = this._node

    if (
      node &&
      node.ownerDocument &&
      node.ownerDocument.defaultView &&
      node instanceof node.ownerDocument.defaultView['HTMLElement']
    ) {
      const newSize =
        direction === 'horizontal' || layout === 'horizontal'
          ? Math.ceil(node.offsetWidth)
          : Math.ceil(node.offsetHeight)

      if (oldSize !== newSize) {
        handleNewMeasurements(index, newSize, isCommitPhase)
      }
    }
  }

  _refSetter = (ref: any) => {
    if (this._resizeObserver !== null && this._node !== null) {
      this._resizeObserver.unobserve(this._node)
    }

    if (ref instanceof HTMLElement) {
      this._didProvideValidRef = true
      this._node = ref
    } else if (ref) {
      this._node = findDOMNode(ref) as HTMLElement
    } else {
      this._node = null
    }

    if (this._resizeObserver !== null && this._node !== null) {
      this._resizeObserver.observe(this._node)
    }
  }

  _onResize = () => {
    if (this.context.visible === false) {
      return
    }
    console.log('GOT RESIZE MEAUSRING')
    this._measureItem(false)
  }
}
