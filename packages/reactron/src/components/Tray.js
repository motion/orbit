import { Tray } from 'electron'
import BaseComponent from './BaseComponent'

const EVENT_KEYS = {
  onClick: 'click',
  onDoubleClick: 'double-click',
  onRightClick: 'right-click',
  onMouseMove: 'mouse-move',
  onMouseEnter: 'mouse-enter',
  onMouseLeave: 'mouse-leave',
  onBalloonShow: 'balloon-show',
  onBalloonClick: 'balloon-click',
  onBalloonClosed: 'balloon-closed',
  onDrop: 'drop',
  onDropFiles: 'drop-files',
  onDropText: 'drop-text',
  onDragEnter: 'drag-enter',
  onDragLeave: 'drag-leave',
  onDragEnd: 'drag-end',
}

export default class TrayElement extends BaseComponent {
  mount() {
    if (!this.props.image) {
      throw new Error(`Expects an image prop with path to image file`)
    }
    this.tray = new Tray(this.props.image)
  }

  propHandlers = {
    image: image => this.tray.setImage(image || ''),
    pressedImage: pressedImage => this.tray.setPressedImage(pressedImage || ''),
    title: title => this.tray.setTitle(title || ''),
    tooltip: tooltip => this.tray.setToolTip(tooltip || ''),
    highlightMode: highlightMode =>
      this.tray.setHighlightMode(highlightMode || 'selection'),
  }

  handleNewProps(keys) {
    console.log('Tray.handleNewProps', keys, !!this.tray)
    try {
      for (const key of keys) {
        const val = this.props[key]
        if (EVENT_KEYS[key]) {
          this.handleEvent(this.tray, EVENT_KEYS[key], val)
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
