import React from 'react'

export default class Window extends React.Component {
  state = {
    showing: false,
    position: 0,
  }

  componentDidUpdate() {
    if (this.props.show) {
      if (!this.state.showing) {
        this.setState({ showing: true })
      }
    }
  }

  getPublicInstance() {
    return this.ref
  }

  setRef = ref => {
    this.ref = ref
  }

  render() {
    const { position, ...props } = this.props

    return (
      <window
        {...props}
        position={[position[0], position[1] + this.state.position]}
        ref={this.setRef}
      />
    )
  }
}
