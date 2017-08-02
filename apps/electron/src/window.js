import React from 'react'

export default class Window extends React.Component {
  state = {
    showing: false,
    position: 0,
  }

  componentDidUpdate() {
    if (this.props.show) {
      console.log('show this window')
      if (!this.state.showing) {
        this.setState({ showing: true })
      }
    }

    if (this.state.showing) {
      this.startAnimate()
    }
  }

  startAnimate = once(() => {
    console.log('startanimate')
    this.interval = setInterval(() => {
      console.log('setstate')
      // this.setState({ position: this.state.position + 10 })
      clearInterval(this.interval)
    }, 1000)
  })

  getPublicInstance() {
    return {}
  }

  render() {
    const { position, ...props } = this.props

    return (
      <window
        {...props}
        position={[position[0], position[1] + this.state.position]}
      />
    )
  }
}
