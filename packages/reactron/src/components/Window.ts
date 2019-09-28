import { Logger } from '@o/logger'
import { BrowserWindow } from 'electron'
import { isEqual } from 'lodash'

import { BaseComponent } from './BaseComponent'

const log = new Logger('reactron')

// TODO: document/type props this takes

const EVENT_KEYS = {
  onReadyToShow: 'ready-to-show',
  onClose: 'close',
  onClosed: 'closed',
  onBlur: 'blur',
  onFocus: 'focus',
}

const properCase = str => `${str[0].toUpperCase()}${str.slice(1)}`

const filterUndefined = obj => {
  const next = {}
  for (const key in obj) {
    if (typeof obj[key] === 'undefined') continue
    next[key] = obj[key]
  }
  return next
}

export class Window extends BaseComponent {
  extensionNames = {}
  options = null
  window = null
  propHandlers = null
  lastProps: any = {}

  updateBounds = () => configureBounds.call(this, this.props)
  updateSize = () => configureSize.call(this, this.props)
  updatePosition = () => configurePosition.call(this, this.props)

  mount() {
    const { props } = this

    this.options = filterUndefined({
      webviewTag: !!props.webviewTag,
      show: props.show === undefined ? true : props.show,
      acceptFirstMouse: !!props.acceptFirstMouse,
      titleBarStyle: props.titleBarStyle,
      vibrancy: props.vibrancy,
      transparent: !!props.transparent,
      // closable: !!props.closable,
      // minimizable: !!props.minimizable,
      // maximizable: !!props.maximizable,
      webPreferences: props.webPreferences,
      blinkFeatures: props.blinkFeatures,
      hasShadow: typeof props.hasShadow === 'undefined' ? true : !!props.hasShadow,
      backgroundColor: props.backgroundColor,
      alwaysOnTop: !!props.alwaysOnTop,
      frame: !!props.frame,
      kiosk: !!props.kiosk,
      fullScreen: !!props.fullScreen,
      icon: props.icon,
      ...(props.defaultSize && {
        width: props.defaultSize[0],
        height: props.defaultSize[1],
      }),
      ...(props.defaultPosition && {
        x: props.defaultPosition[0],
        y: props.defaultPosition[1],
      }),
      ...props.defaultBounds,
    })

    this.propHandlers = {
      kiosk: this.handleSetProp('kiosk'),
      closable: this.handleSetProp('closable'),
      minimizable: this.handleSetProp('minimizable'),
      maximizable: this.handleSetProp('maximizable'),
      vibrancy: this.handleSetProp('vibrancy'),
      fullScreen: this.handleSetProp('fullScreen'),
      visibleOnAllWorkspaces: this.handleSetProp('visibleOnAllWorkspaces'),
      fullScreenable: this.handleSetProp('fullScreenable'),
      ignoreMouseEvents: this.handleSetProp('ignoreMouseEvents', x => !!x),
      focusable: this.handleSetProp('focusable', x => (x === undefined ? true : x)),
      opacity: this.handleSetProp('opacity'),
      // can be an array
      alwaysOnTop: this.handleSetProp('alwaysOnTop', x => x),
      showDevTools: propVal => {
        if (propVal) {
          this.window.webContents.openDevTools()
        } else {
          this.window.webContents.closeDevTools()
        }
      },
      show: propVal => {
        console.log('show', propVal)
        if (propVal) {
          // ensure it happens after positioning
          setTimeout(() => {
            if (this.props.focus) {
              this.window.show()
            } else {
              this.window.showInactive()
            }
          }, 0)
        } else {
          this.window.hide()
        }
      },
      bounds: this.updateBounds,
      defaultBounds: this.updateBounds,
      animateBounds: this.updateBounds,
      size: this.updateSize,
      onResize: this.updateSize,
      position: this.updatePosition,
      onMove: this.updatePosition,
      onMoved: this.updatePosition,
      animatePosition: this.updatePosition,
      animateSize: this.updateSize,
      file: () => configureFile.call(this, this.props),
      acceptFirstMouse: () => {
        if (process.env.NODE_ENV !== 'production') {
          console.warn(
            'A component is changing the acceptFirstMouse prop of a window. ' +
              'The acceptFirstMouse prop only has effect when the window is first rendered, ' +
              'changing it after the first render does nothing. ',
          )
        }
      },
    }

    if (props.window) {
      this.window = props.window
      this.handleNewProps(Object.keys(this.props))
    } else {
      this.window = new BrowserWindow(this.options)
    }
  }

  handleSetProp(key, handler = _ => _) {
    const setter = propVal => {
      if (this.unmounted) return
      // changed value
      const newVal = [].concat(handler(propVal))
      if (!isEqual(this.options[key], newVal)) {
        const setterInst = this.window[`set${properCase(key)}`]
        if (setterInst) {
          setterInst.call(this.window, ...newVal)
          this.options[key] = newVal
        } else {
          this.window[key] = newVal
        }
      }
    }
    return setter
  }

  unmount() {
    log.info('unmounting', this.props)
    this.window.close()
    this.unmounted = true
  }

  handleNewProps(keys) {
    try {
      for (const key of keys) {
        const val = this.props[key]
        if (EVENT_KEYS[key]) {
          this.handleEvent(this.window, EVENT_KEYS[key], val)
          continue
        }
        if (this.propHandlers[key]) {
          this.propHandlers[key](val)
        }
      }
    } catch (e) {
      log.info('error with prop handlers')
      console.log(e)
    }
  }
}

function configureFile(this: Window, { file }) {
  if (file) {
    this.window.loadURL(`${file}`)
  } else {
    console.warn('No file given to electron window')
  }
}

function configureSize(this: Window, { size, onResize, animateSize }) {
  if (this.unmounted) return
  if (Array.isArray(size)) {
    size = size.map(x => Math.round(x))
  }
  // window.setPosition(x, y[, animate])
  if (size && typeof animateSize === 'boolean') {
    size[2] = animateSize
  }
  try {
    this.handleEvent(this.window, 'resize', onResize, rawHandler => {
      rawHandler(this.window.getSize())
    })
    if (!size) {
      this.window.resizable = true
      return
    }
    if (size && onResize) {
      this.window.setSize(...size)
      this.window.resizable = true
      return
    }
    if (size && !onResize) {
      this.window.setSize(...size)
      this.window.resizable = false
      return
    }
  } catch (e) {
    log.info('error in configureSize', e)
  }
}

function configureBounds(this: Window, { defaultBounds, bounds, animateBounds }) {
  if (this.unmounted) return
  const allBounds = bounds || defaultBounds
  if (!allBounds) return
  try {
    if (allBounds) {
      this.window.setBounds(allBounds, !!animateBounds)
      return
    }
  } catch (e) {
    log.info('error in configureSize', e)
  }
}

function configurePosition(
  this: Window,
  { position, onMove, onMoved, defaultPosition, animatePosition },
) {
  if (this.unmounted) return
  if (!this.window) return
  try {
    if (typeof animatePosition === 'boolean') {
      position[2] = animatePosition
    }
    const end = m => {
      throw new Error(`position ${position} ended with error of: ${m}`)
    }
    this.handleEvent(this.window, 'move', onMove, rawHandler => {
      const nextPosition = this.window.getPosition()
      rawHandler(nextPosition)
    })
    this.handleEvent(this.window, 'moved', onMoved, rawHandler => {
      const nextPosition = this.window.getPosition()
      rawHandler(nextPosition)
    })
    if (!position && defaultPosition) {
      // only update defaults if changed
      if (!isEqual(this.lastProps.defaultPosition, defaultPosition)) {
        this.lastProps.defaultPosition = defaultPosition
        this.window.setPosition(...defaultPosition)
        this.window.movable = true
      }
      return
    }
    if (!position && !defaultPosition) {
      this.window.movable = true
      return
    }
    if (position) {
      if (!Array.isArray(position)) end('not array')
      if (typeof position[0] !== 'number' || typeof position[1] !== 'number') end('not number')
      if (onMove || onMoved) {
        this.window.setPosition(...position)
        this.window.movable = true
        return
      }
      if (!onMove && !onMoved) {
        this.window.setPosition(...position)
        this.window.movable = false
        return
      }
    }
  } catch (err) {
    if (err.stack.indexOf('Object has been destroyed')) return
    console.log('Window configure error', err.stack)
  }
}
