import { cssString } from '@o/css'
import { Component } from 'react'
import { createPortal } from 'react-dom'

type Props = {
  children?: any
  prepend?: any
  style?: any
  className?: string
}

export class Portal extends Component<Props> {
  popup: HTMLDivElement | null = null

  constructor(a, b) {
    super(a, b)
    this.popup = document.createElement('div')
    document.body[this.props.prepend ? 'prepend' : 'appendChild'](this.popup)
    if (this.props.style) {
      this.popup.setAttribute('style', cssString(this.props.style))
    }
    if (this.props.className) {
      this.popup.setAttribute('className', this.props.className)
    }
  }

  componentWillUnmount() {
    this.popup && document.body.removeChild(this.popup)
  }

  render() {
    if (this.popup) {
      return createPortal(this.props.children, this.popup)
    }
    return null
  }
}
