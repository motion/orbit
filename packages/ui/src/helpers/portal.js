import { Component } from 'react'
import PropTypes from 'prop-types'
import ReactDom from 'react-dom'

const useCreatePortal = typeof ReactDom.createPortal === 'function'

export class Portal extends Component {
  static propTypes = {
    children: PropTypes.node,
  }

  constructor(a, b) {
    super(a, b)
    this.popup = document.createElement('div')
    document.body.appendChild(this.popup)
    this.renderLayer()
  }

  componentDidUpdate() {
    this.renderLayer()
  }

  componentWillUnmount() {
    if (!useCreatePortal) {
      ReactDom.unmountComponentAtNode(this.popup)
    }
    document.body.removeChild(this.popup)
  }

  renderLayer() {
    if (!useCreatePortal) {
      ReactDom.unstable_renderSubtreeIntoContainer(
        this,
        this.props.children,
        this.popup,
      )
    }
  }

  render() {
    if (useCreatePortal) {
      return ReactDom.createPortal(this.props.children, this.popup)
    }
    return null
  }
}
