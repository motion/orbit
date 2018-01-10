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
    // this.update()
  }

  handleNewProps(keys) {
    console.log('keys', keys)
    // handle new keys
    // try {
    //   this.tray.setImage(this.props.image || '')
    //   this.tray.setPressedImage(this.props.pressedImage || '')
    //   this.tray.setTitle(this.props.title || '')
    //   this.tray.setToolTip(this.props.tooltip || '')
    //   this.tray.setHighlightMode(this.props.highlightMode || 'selection')
    //   for (const key of keys) {
    //     const val = this.props[key]
    //     if (EVENT_KEYS[key]) {
    //       this.handleEvent(this.tray, EVENT_KEYS[key], val)
    //       continue
    //     }
    //   }
    // } catch (e) {
    //   console.log('error with prop handlers')
    //   console.log(e)
    // }
  }
}
