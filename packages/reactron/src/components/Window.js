// @flow
import BaseComponent from './BaseComponent'
import { BrowserWindow } from 'electron'
import debug from 'debug'

const log = debug('reactron')

// TODO: document/type props this takes

const EVENT_KEYS = {
  onReadyToShow: 'ready-to-show',
  onClose: 'close',
  onClosed: 'closed',
  onBlur: 'blur',
  onFocus: 'focus',
}

const properCase = str => `${str[0].toUpperCase()}${str.slice(1)}`

// these should only load once, even across many windows
const ALL_EXTENSIONS = new Set()

export default class Window extends BaseComponent {
  mount() {
    this.extensionNames = {}

    const { props } = this
    this.options = {
      show: props.show === undefined ? true : props.show,
      acceptFirstMouse: !!props.acceptFirstMouse,
      titleBarStyle: props.titleBarStyle,
      vibrancy: props.vibrancy,
      transparent: !!props.transparent,
      webPreferences: props.webPreferences,
      hasShadow: !!props.hasShadow,
      backgroundColor: props.backgroundColor,
      alwaysOnTop: !!props.alwaysOnTop,
      frame: !!props.frame,
      kiosk: !!props.kiosk,
      fullScreen: !!props.fullScreen,
    }
    this.window = new BrowserWindow(this.options)

    this.updateSize = () => configureSize.call(this, this.props)
    this.updatePosition = () => configurePosition.call(this, this.props)

    // handles simple prop sync to
    const focusable = this.handleSettableProp(
      'focusable',
      x => (x === undefined ? true : x),
    )
    const ignoreMouseEvents = this.handleSettableProp(
      'ignoreMouseEvents',
      x => !!x,
    )

    ignoreMouseEvents(props.ignoreMouseEvents)
    focusable(props.focusable)

    this.propHandlers = {
      kiosk: v => this.window.setKiosk(v),
      fullScreen: v => this.window.setFullScreen(v),
      ignoreMouseEvents,
      focusable,
      devToolsExtensions: () => configureExtensions.call(this, this.props),
      showDevTools: propVal => {
        if (propVal) {
          this.window.webContents.openDevTools()
        } else {
          this.window.webContents.closeDevTools()
        }
      },
      show: propVal => {
        if (propVal) {
          this.window.show()
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
      alwaysOnTop: this.handleSettableProp('alwaysOnTop', x => !!x),
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

  handleSettableProp(key, handler = _ => _) {
    return propVal => {
      if (this.unmounted) {
        return
      }
      // changed value
      const newVal = handler(propVal)
      if (this.options[key] !== newVal) {
        const setter = this.window[`set${properCase(key)}`]
        if (setter) {
          log('update window, set', key, newVal)
          setter.call(this.window, newVal)
          this.options[key] = newVal
        }
      }
    }
  }

  unmount() {
    log('unmounting', this.props)
    this.window.close()
  }

  handleNewProps(keys: Array<string>) {
    if (!this.window) {
      log('no window ey')
      return
    }
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
      log('error with prop handlers')
      console.log(e)
    }
  }
}

function configureExtensions({ devToolsExtensions }) {
  if (this.unmounted) return
  const incoming = new Set(devToolsExtensions)
  const newExtensions = new Set(
    [...incoming].filter(x => !ALL_EXTENSIONS.has(x)),
  )
  const oldExtensions = [...ALL_EXTENSIONS].filter(x => !incoming.has(x))
  for (const path of oldExtensions) {
    BrowserWindow.removeDevToolsExtension(this.extensionNames[path])
    ALL_EXTENSIONS.delete(path)
    delete this.extensionNames[path]
  }
  for (const path of newExtensions) {
    const name = BrowserWindow.addDevToolsExtension(path)
    ALL_EXTENSIONS.add(path)
    this.extensionNames[path] = name
  }
}

function configureFile({ file }: Object) {
  if (file) {
    this.window.loadURL(`${file}`)
  } else {
    console.warn('No file given to electron window')
  }
}

function configureSize({
  size: oSize,
  onResize,
  defaultSize,
  animateSize,
}: Object) {
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
      const size = this.window.getSize()
      rawHandler(size)
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
    log('error in configureSize', e)
  }
}

function configurePosition({
  position,
  onMove,
  onMoved,
  defaultPosition,
  animatePosition,
}: Object) {
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
      const position = this.window.getPosition()
      rawHandler(position)
    })

    this.handleEvent(this.window, 'moved', onMoved, rawHandler => {
      const position = this.window.getPosition()
      rawHandler(position)
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
      if (!Array.isArray(position)) end(`not array`)
      if (typeof position[0] !== 'number' || typeof position[1] !== 'number')
        end(`not number`)
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
