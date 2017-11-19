// @flow
import { BrowserWindow } from 'electron'
import configureEventHandler from '../utils/configureEventHandler'
import isEqual from 'lodash.isequal'

const BASIC_EVENT_PROPS = {
  onReadyToShow: 'ready-to-show',
  onClose: 'close',
  onClosed: 'closed',
  onBlur: 'blur',
  onFocus: 'focus',
}

export default class WindowElement {
  extensionNames: Object
  devExtensions: Set
  parentWindow: null | BrowserWindow
  window: BrowserWindow
  attachedHandlers: { [string]: Function }

  componentDidMount(props: Object) {
    console.log('mounting window')
    this.window = new BrowserWindow({
      show: false,
      acceptFirstMouse: !!props.acceptFirstMouse,
      titleBarStyle: props.titleBarStyle,
      vibrancy: props.vibrancy,
      transparent: !!props.transparent,
      webPreferences: props.webPreferences,
      hasShadow: props.hasShadow,
      backgroundColor: props.backgroundColor,
      alwaysOnTop: !!props.alwaysOnTop,
    })
    this.extensionNames = {}
    this.devExtensions = new Set()
    this.parentWindow = null
    this.attachedHandlers = {}

    this.handleNewProps(Object.keys(this.props))

    if (this.parentWindow) {
      this.window.setParentWindow(this.parentWindow)
    }
  }

  componentWillUnmount(): void {
    this.disposed = true
    this.window.close()
    for (const eventKey in this.attachedHandlers) {
      const handler = this.attachedHandlers[eventKey]
      this.window.removeListener(eventKey, handler)
    }
  }

  componentDidUpdate(prevProps: Object) {
    const newPropKeys = Object.keys(this.props).map(
      k => !isEqual(this.props[k], prevProps[k])
    )
    this.handleNewProps(newPropKeys)
  }

  handleNewProps(newPropKeys: Array<string>) {
    for (const propKey of newPropKeys) {
      const propVal = this.props[propKey]
      if (this.newPropHandlers[propKey]) {
        this.newPropHandlers[propKey](propVal)
      }
    }
  }

  configureEvent = (propName, eventName, value, handler = cb => cb()) => {
    configureEventHandler(
      this.window,
      this.attachedHandlers,
      propName,
      eventName,
      value,
      handler
    )
  }

  updateSize = () => configureSize.call(this, this.props)
  updatePosition = () => configurePosition.call(this, this.props)

  newPropHandlers = {
    ...Object.keys(BASIC_EVENT_PROPS).reduce(
      (acc, propKey) => ({
        ...acc,
        [propKey]: propVal =>
          this.configureEvent(propKey, BASIC_EVENT_PROPS[propKey], propVal),
      }),
      {}
    ),
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

function configureFile({ file }: Object) {
  if (file) {
    this.window.loadURL(`${file}`)
  }
}

function configureSize({ size, onResize, defaultSize }: Object) {
  if (this.disposed || this.window.disposed) {
    return
  }

  try {
    this.configureEvent('onResize', 'resize', onResize, rawHandler => {
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
    console.log('error in configureSize')
  }
}

function configurePosition({
  position,
  onMove,
  onMoved,
  defaultPosition,
}: Object) {
  if (this.disposed || this.window.disposed) {
    return
  }

  this.configureEvent('onMove', 'move', onMove, rawHandler => {
    const position = this.window.getPosition()
    rawHandler(position)
  })

  this.configureEvent('onMoved', 'moved', onMoved, rawHandler => {
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
  if (this.disposed || this.window.disposed) {
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
  console.log('added extensions' + [...newExtensions])
}
