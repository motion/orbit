// @flow

import path from 'path'
import { BrowserWindow } from 'electron'
import BaseElement from './BaseElement'
import TextElement from './TextElement'

import type { ElectronApp } from 'electron'
import type IonizeContainer from '../IonizeContainer'
import type { HostContext } from '../IonizeHostConfig'
import configureWrappedEventHandler from '../util/configureWrappedEventHandler'

/* PROPS NEEDED
 * title
 * minSize
 * maxSize
 *
 * NOTE: ABOUT CONTROLLED ATTRIBUTES
 * Controlled attributes behave in similar fashion to the <input> tag in React
 * DOM. Specifically, if you include a prop which specifies the value of a
 * controlled attribute, you must also include an event handler which updates
 * the value of that prop.
 *
 * For instance, If you define the 'size' prop, the window will be set to
 * 'resizable: false', and the user will not be allowed to change it UNLESS
 * you also define the 'onResize' event handler, which should cause the size
 * to change. In this case, you should ensure that the `size` prop is updated
 * accordingly.
 *
 * If you do NOT define a controlled attribute, but you would still like to
 * define an initial value, most controlled attributes have a 'defaultXXX'
 * analogue that simply sets the value when the element is created and then
 * allows the user to adjust it as they please.
 *
 * Props that behave this way are marked as such below.
 *
 * size (controlled)
 * onResize
 * resizable
 * defaultSize
 *
 *  * position (controlled)
 * onMove
 * onMoved
 * defaultPosition
 * movable
 *
 * fullscreen (controlled)
 * onEnterFullScreen
 * onLeaveFullScreen
 * fullscreenable
 *
 * minimized (controlled)
 * onMinimize
 * onRestore
 * minimizable
 *
 * maximized (controlled)
 * onMaximize
 * onUnmaximize
 * maximizable
 *
 * focused (controlled)
 * onBlur
 * onFocus
 * focusable
 *
 * - By default, the show() method on a BrowserWindow should be called
 *   immediately upon mount.
 * show (controlled)
 * onReadyToShow
 * onShow
 * onHide
 *
 * closable
 *
 * TBD props
 * alwaysOnTop
 * skipTaskbar
 * autoHideMenuBar
 * onPageTitleUpdated
 * onUnresponsive
 * onResponsive
 * onAppCommand
 * onScrollTouchBegin
 * onScrollTouchEnd
 * onScrollTouchEdge
 * onSwipe
 */

const SUPPORTED_PROPS = {
  show: true,
  position: true,
  size: true,
  file: true,
  onReadyToShow: true,
  onResize: true,
  showDevTools: true,
  acceptFirstMouse: true,
  onClose: true,
  onClosed: true,
  onBlur: true,
  onFocus: true,
}

const BASIC_PROPS = {
  onReadyToShow: 'ready-to-show',
  onClose: 'close',
  onClosed: 'closed',
  onBlur: 'blur',
  onFocus: 'focus',
}

export default class WindowElement extends BaseElement {
  parentWindow: null | BrowserWindow
  window: BrowserWindow
  attachedHandlers: { [string]: Function }

  constructor(props: Object, rootContainer: IonizeContainer) {
    super(props, rootContainer)

    this.window = new BrowserWindow({
      show: false,
      acceptFirstMouse: !!props.acceptFirstMouse,
      titleBarStyle: props.titleBarStyle,
      vibrancy: props.vibrancy,
      transparent: !!props.transparent,
      webPreferences: props.webPreferences,
      hasShadow: props.hasShadow,
    })

    this.parentWindow = null
    this.attachedHandlers = {}
  }

  appendChildBeforeMount(child: BaseElement | TextElement): void {
    if (child instanceof WindowElement) {
      child.parentWindow = this.window
    }
  }

  // Hook up event handlers, if they exist
  finalizeBeforeMount(type: string, props: Object): boolean {
    for (const propName of Object.keys(props)) {
      if (BASIC_PROPS[propName]) {
        this.configureEvent(propName, BASIC_PROPS[propName], props[propName])
      }
    }

    if (props.showDevTools) {
      this.window.webContents.openDevTools()
    }

    configureSize.call(this, props)
    configurePosition.call(this, props)
    configureFile.call(this, props)

    if (this.parentWindow) {
      this.window.setParentWindow(this.parentWindow)
    }

    return true
  }

  commitMount(newProps: Object) {
    if (newProps.show) {
      this.window.show()
    }
  }

  finalizeBeforeRemoval(): void {
    this.disposed = true
    this.window.disposed = true
    this.window.close()
    for (const eventKey in this.attachedHandlers) {
      const handler = this.attachedHandlers[eventKey]
      this.window.removeListener(eventKey, handler)
    }
  }

  getPublicInstance(): BrowserWindow {
    return this.window
  }

  getSupportedProps(): { [string]: boolean } {
    return SUPPORTED_PROPS
  }

  configureEvent = (propName, eventName, value, handler = cb => cb()) => {
    configureWrappedEventHandler(
      this.window,
      this.attachedHandlers,
      propName,
      eventName,
      value,
      handler
    )
  }

  commitUpdate(
    updatePayload: Array<mixed>,
    oldProps: Object,
    newProps: Object
  ): void {
    if (this.disposed) {
      return
    }

    for (let i = 0; i < updatePayload.length; i += 2) {
      let propKey = updatePayload[i]
      let propVal = updatePayload[i + 1]

      // If we hit this point, we KNOW the prop changed, so we don't need to do
      // any checking. Just update to the new value.

      if (BASIC_PROPS[propKey]) {
        this.configureEvent(propKey, BASIC_PROPS[propKey], propVal)
        continue
      }

      switch (propKey) {
        case 'showDevTools':
          if (propVal) {
            this.window.webContents.openDevTools()
          } else {
            this.window.webContents.closeDevTools()
          }
          break
        case 'show': {
          if (propVal) {
            this.window.show()
          } else {
            this.window.hide()
          }
          break
        }
        case 'size':
        case 'defaultSize':
        case 'onResize': {
          // TODO: figure out if we can avoid calling this multiple times
          configureSize.call(this, newProps)
          break
        }
        case 'position':
        case 'defaultPosition':
        case 'onMove':
        case 'onMoved': {
          // TODO: figure out if we can avoid calling this multiple times
          configurePosition.call(this, newProps)
          break
        }
        case 'file': {
          configureFile.call(this, newProps)
          break
        }
        case 'acceptFirstMouse':
          if (process.env.NODE_ENV !== 'production') {
            console.warn(
              'A component is changing the acceptFirstMouse prop of a window. ' +
                'The acceptFirstMouse prop only has effect when the window is first rendered, ' +
                'changing it after the first render does nothing. '
            )
          }
          break
      }
    }
  }

  appendChild(child: BaseElement | TextElement): void {
    if (child instanceof WindowElement) {
      child.parentWindow = this.window
    }
  }

  insertBefore(
    child: BaseElement | TextElement,
    beforeChild: BaseElement | TextElement
  ): void {
    if (child instanceof WindowElement) {
      child.parentWindow = this.window
    }
  }

  removeChild(child: BaseElement | TextElement): void {
    if (child instanceof WindowElement) {
      child.parentWindow = null
    }
  }
}

function configureFile({ file }: Object) {
  if (file) {
    this.window.loadURL(`${file}`)
  }
}

function configureSize({ size, onResize, defaultSize }: Object) {
  if (this.window.disposed) {
    return
  }

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
}

function configurePosition({
  position,
  onMove,
  onMoved,
  defaultPosition,
}: Object) {
  if (this.window.disposed) {
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
