import { Component } from 'react'
import { createPortal } from 'react-dom'

type Props = {
  children?: any
}

export class Portal extends Component<Props> {
  popup = null

  constructor(a, b) {
    super(a, b)
    this.popup = document.createElement('div') as HTMLDivElement
    document.body.appendChild(this.popup)
  }

  componentWillUnmount() {
    document.body.removeChild(this.popup)
  }

  render() {
    return createPortal(this.props.children, this.popup)
  }
}
