import { Logger } from '@o/logger'
import { BrowserWindow } from 'electron'
import isEqual from 'lodash.isequal'
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

  updateSize = () => configureSize.call(this, this.props)
  updatePosition = () => configurePosition.call(this, this.props)

  mount() {
    const { props } = this
    this.options = filterUndefined({
      show: props.show === undefined ? true : props.show,
      acceptFirstMouse: !!props.acceptFirstMouse,
      titleBarStyle: props.titleBarStyle,
      vibrancy: props.vibrancy,
      transparent: !!props.transparent,
      webPreferences: props.webPreferences,
      blinkFeatures: props.blinkFeatures,
      hasShadow: typeof props.hasShadow === 'undefined' ? true : !!props.hasShadow,
      backgroundColor: props.backgroundColor,
      alwaysOnTop: !!props.alwaysOnTop,
      frame: !!props.frame,
      kiosk: !!props.kiosk,
      fullScreen: !!props.fullScreen,
      icon: props.icon,
    })

    console.log('new BrowserWindow(', this.options, ')')

    this.window = new BrowserWindow(this.options)

    this.propHandlers = {
      kiosk: this.handleSetProp('kiosk'),
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
      size: this.updateSize,
      defaultSize: this.updateSize,
      onResize: this.updateSize,
      position: this.updatePosition,
      defaultPosition: this.updatePosition,
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
  }

  handleSetProp(key, handler = _ => _) {
    const setter = propVal => {
      if (this.unmounted) return
      // changed value
      const newVal = [].concat(handler(propVal))
      if (!isEqual(this.options[key], newVal)) {
        const setterInst = this.window[`set${properCase(key)}`]
        if (setterInst) {
          log.info('update window, set', key, newVal)
          setterInst.call(this.window, ...newVal)
          this.options[key] = newVal
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

function configureSize(this: Window, { size: oSize, onResize, defaultSize, animateSize }) {
  if (this.unmounted) {
    return
  }
  let size = oSize
  if (Array.isArray(oSize)) {
    size = size.map(x => Math.round(x))
  }
  // window.setPosition(x, y[, animate])
  if (typeof animateSize === 'boolean') {
    size[2] = animateSize
  }
  try {
    this.handleEvent(this.window, 'resize', onResize, rawHandler => {
      rawHandler(this.window.getSize())
    })
    if (!size && defaultSize) {
      this.window.setSize(...defaultSize)
      this.window.setResizable(true)
      return
    }
    if (!size && !defaultSize) {
      this.window.setResizable(true)
      return
    }
    if (size && onResize) {
      this.window.setSize(...size)
      this.window.setResizable(true)
      return
    }
    if (size && !onResize) {
      this.window.setSize(...size)
      this.window.setResizable(false)
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
    // window.setPosition(x, y[, animate])
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
      this.window.setPosition(...defaultPosition)
      this.window.setMovable(true)
      return
    }
    if (!position && !defaultPosition) {
      this.window.setMovable(true)
      return
    }
    if (position) {
      if (!Array.isArray(position)) end('not array')
      if (typeof position[0] !== 'number' || typeof position[1] !== 'number') end('not number')
      if (onMove || onMoved) {
        this.window.setPosition(...position)
        this.window.setMovable(true)
        return
      }
      if (!onMove && !onMoved) {
        this.window.setPosition(...position)
        this.window.setMovable(false)
        return
      }
    }
  } catch (err) {
    if (err.stack.indexOf('Object has been destroyed')) return
    console.log('Window configure error', err.stack)
  }
}
