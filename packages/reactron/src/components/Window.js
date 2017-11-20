// @flow
import BaseComponent from './BaseComponent'
import { BrowserWindow } from 'electron'

const EVENT_KEYS = {
  onReadyToShow: 'ready-to-show',
  onClose: 'close',
  onClosed: 'closed',
  onBlur: 'blur',
  onFocus: 'focus',
}

export default class Window extends BaseComponent {
  mount() {
    this.extensionNames = {}
    this.devExtensions = new Set()

    const { props } = this
    this.window = new BrowserWindow({
      show: props.show === undefined ? true : props.show,
      acceptFirstMouse: !!props.acceptFirstMouse,
      titleBarStyle: props.titleBarStyle,
      vibrancy: props.vibrancy,
      transparent: !!props.transparent,
      webPreferences: props.webPreferences,
      hasShadow: props.hasShadow,
      backgroundColor: props.backgroundColor,
      alwaysOnTop: !!props.alwaysOnTop,
    })

    this.updateSize = () => configureSize.call(this, this.props)
    this.updatePosition = () => configurePosition.call(this, this.props)
    this.propHandlers = {
      devToolsExtensions: () => {
        configureExtensions.call(this, this.props)
      },
      showDevTools: propVal => {
        if (propVal) {
          this.window.webContents.openDevTools()
        } else {
          this.window.webContents.closeDevTools()
        }
      },
      show: propVal => {
        console.log('calling show with', propVal)
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
      file: () => configureFile.call(this, this.props),
      acceptFirstMouse: () => {
        if (process.env.NODE_ENV !== 'production') {
          console.warn(
            'A component is changing the acceptFirstMouse prop of a window. ' +
              'The acceptFirstMouse prop only has effect when the window is first rendered, ' +
              'changing it after the first render does nothing. '
          )
        }
      },
    }
  }

  unmount() {
    this.window.close()
  }

  handleNewProps(keys: Array<string>) {
    if (!this.window) {
      console.log('no window ey')
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
      console.log('error with prop handlers')
      console.log(e)
    }
  }
}

function configureFile({ file }: Object) {
  if (file) {
    this.window.loadURL(`${file}`)
  } else {
    console.warn('No file given to electron window')
  }
}

function configureSize({ size, onResize, defaultSize }: Object) {
  if (this.unmounted) {
    return
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
    console.log('error in configureSize', e)
  }
}

function configurePosition({
  position,
  onMove,
  onMoved,
  defaultPosition,
}: Object) {
  if (this.unmounted) {
    return
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
  if (position && (onMove || onMoved)) {
    this.window.setPosition(...position)
    this.window.setMovable(true)
    return
  }
  if (position && !(onMove || onMoved)) {
    this.window.setPosition(...position)
    this.window.setMovable(false)
    return
  }
}

function configureExtensions({ devToolsExtensions }) {
  if (this.unmounted) {
    return
  }
  const incoming = new Set(devToolsExtensions)

  const newExtensions = new Set(
    [...incoming].filter(x => !this.devExtensions.has(x))
  )
  const oldExtensions = [...this.devExtensions].filter(x => !incoming.has(x))
  for (const path of oldExtensions) {
    BrowserWindow.removeDevToolsExtension(this.extensionNames[path])
    this.devExtensions.delete(path)
    delete this.extensionNames[path]
  }
  for (const path of newExtensions) {
    const name = BrowserWindow.addDevToolsExtension(path)
    this.devExtensions.add(path)
    this.extensionNames[path] = name
  }
}
