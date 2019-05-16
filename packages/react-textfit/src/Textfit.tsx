import { debounce } from 'lodash'
import React from 'react'
import ResizeObserver from 'resize-observer-polyfill'

import { innerHeight, innerWidth } from './utils/innerSize'
import series from './utils/series'
import shallowEqual from './utils/shallowEqual'
import throttle from './utils/throttle'
import uniqueId from './utils/uniqueId'
import { waitForFonts } from './utils/waitForFonts'
import whilst from './utils/whilst'

function assertElementFitsWidth(el, width) {
  // -1: temporary bugfix, will be refactored soon
  return el.scrollWidth - 1 <= width
}

function assertElementFitsHeight(el, height) {
  // -1: temporary bugfix, will be refactored soon
  return el.scrollHeight - 1 <= height
}

function noop() {}

export type TextFitProps = {
  children: React.ReactNode
  text: string
  min: number
  max: number
  mode: 'single' | 'multi'
  forceSingleModeWidth: boolean
  throttle: number
  onReady: (size: number) => any
  autoResize: boolean
  resizable: boolean
  style?: Object
}

export default class TextFit extends React.Component<TextFitProps> {
  static defaultProps = {
    min: 1,
    max: 100,
    mode: 'multi',
    forceSingleModeWidth: true,
    throttle: 200,
    autoResize: true,
    onReady: noop,
    children: undefined,
    text: undefined,
    resizable: false,
  }

  pid = 0
  parent = React.createRef<HTMLDivElement>()
  child = React.createRef<HTMLDivElement>()
  ro = new ResizeObserver(() => this.handleParentResize())

  state = {
    fontSize: null,
    ready: false,
  }

  componentDidMount() {
    const { autoResize, resizable } = this.props
    if (autoResize) {
      window.addEventListener('resize', this.handleWindowResize)
    }
    if (resizable) {
      this.ro.observe(this.parent.current)
    }

    this.process()

    const fonts = window
      .getComputedStyle(this.parent.current)
      .fontFamily.split(',')
      .map(x => x.trim().replace(/\"/g, ''))
      .filter(x => x[0] !== '-' && x !== 'system-ui' && x !== 'sans-serif' && x !== 'serif')

    waitForFonts(
      fonts,
      debounce(() => {
        this.process()
      }, this.props.throttle),
    )
  }

  inputFocus(prevProps) {
    const { ready } = this.state
    if (!ready) return
    if (shallowEqual(this.props, prevProps)) return
    const { resizable } = this.props
    const { resizable: prevResizable } = prevProps
    if (!resizable && prevResizable) {
      this.ro.unobserve(this.parent.current)
    }
    if (resizable && !prevResizable) {
      this.ro.observe(this.parent.current)
    }
    this.process()
  }

  componentWillUnmount() {
    const { autoResize, resizable } = this.props
    if (autoResize) {
      window.removeEventListener('resize', this.handleWindowResize)
    }
    if (resizable) {
      this.ro.disconnect()
    }
    // Setting a new pid will cancel all running processes
    this.pid = uniqueId()
  }

  handleWindowResize = throttle(() => {
    this.process()
  }, this.props.throttle)

  handleParentResize = throttle(() => {
    this.process()
  }, this.props.throttle)

  process = () => {
    const { min, max, mode, forceSingleModeWidth, onReady } = this.props
    const el = this.parent.current
    const wrapper = this.child.current

    const originalWidth = innerWidth(el)
    const originalHeight = innerHeight(el)

    if (originalHeight <= 0 || Number.isNaN(originalHeight)) {
      console.warn(
        'Can not process element without height. Make sure the element is displayed and has a static height.',
      )
      return
    }

    if (originalWidth <= 0 || Number.isNaN(originalWidth)) {
      console.warn(
        'Can not process element without width. Make sure the element is displayed and has a static width.',
      )
      return
    }

    const pid = uniqueId()
    this.pid = pid

    const shouldCancelProcess = () => pid !== this.pid

    const testPrimary =
      mode === 'multi'
        ? () => assertElementFitsHeight(wrapper, originalHeight)
        : () => assertElementFitsWidth(wrapper, originalWidth)

    const testSecondary =
      mode === 'multi'
        ? () => assertElementFitsWidth(wrapper, originalWidth)
        : () => assertElementFitsHeight(wrapper, originalHeight)

    let mid
    let low = min
    let high = max

    this.setState({ ready: false })

    series(
      [
        // Step 1:
        // Binary search to fit the element's height (multi line) / width (single line)
        stepCallback =>
          whilst(
            () => low <= high,
            // eslint-disable-next-line
            whilstCallback => {
              if (shouldCancelProcess()) {
                return whilstCallback(true)
              }
              mid = parseInt(`${(low + high) / 2}`, 10)
              this.setState({ fontSize: mid }, () => {
                if (shouldCancelProcess()) {
                  return whilstCallback(true)
                }
                if (testPrimary()) {
                  low = mid + 1
                } else {
                  high = mid - 1
                }
                return whilstCallback()
              })
            },
            stepCallback,
          ),
        // Step 2:
        // Binary search to fit the element's width (multi line) / height (single line)
        // If mode is single and forceSingleModeWidth is true, skip this step
        // in order to not fit the elements height and decrease the width
        stepCallback => {
          if (mode === 'single' && forceSingleModeWidth) {
            return stepCallback()
          }
          if (testSecondary()) {
            return stepCallback()
          }
          low = min
          high = mid
          return whilst(
            () => low < high,
            // eslint-disable-next-line
            whilstCallback => {
              if (shouldCancelProcess()) {
                return whilstCallback(true)
              }
              mid = parseInt(`${(low + high) / 2}`, 10)
              this.setState({ fontSize: mid }, () => {
                if (pid !== this.pid) {
                  return whilstCallback(true)
                }
                if (testSecondary()) {
                  low = mid + 1
                } else {
                  high = mid - 1
                }
                return whilstCallback()
              })
            },
            stepCallback,
          )
        },
        // Step 3
        // Limits
        // eslint-disable-next-line
        stepCallback => {
          // We break the previous loop without updating mid for the final time,
          // so we do it here:
          mid = Math.min(low, high)

          // Ensure we hit the user-supplied limits
          mid = Math.max(mid, min)
          mid = Math.min(mid, max)

          // Sanity check:
          mid = Math.max(mid, 0)

          if (shouldCancelProcess()) return stepCallback(true)
          this.setState({ fontSize: mid }, stepCallback)
        },
      ],
      err => {
        // err will be true, if another process was triggered
        if (err || shouldCancelProcess()) return
        if (!this.state.ready) {
          this.setState({ ready: true }, () => onReady(mid))
        }
      },
    )
  }

  render() {
    const {
      children,
      text,
      style,
      min,
      max,
      mode,
      forceSingleModeWidth,
      throttle,
      autoResize,
      onReady,
      resizable,
      ...props
    } = this.props
    const { fontSize, ready } = this.state
    const finalStyle = {
      ...style,
      fontSize,
      height: fontSize,
      lineHeight: `${fontSize}px`,
    }

    const wrapperStyle = {
      display: ready ? 'block' : 'inline-block',
    }

    if (mode === 'single') {
      wrapperStyle['whiteSpace'] = 'nowrap'
    }

    return (
      <div ref={this.parent} style={finalStyle} {...props}>
        <div ref={this.child} style={wrapperStyle}>
          {text && typeof children === 'function' ? (ready ? children(text) : text) : children}
        </div>
      </div>
    )
  }
}
