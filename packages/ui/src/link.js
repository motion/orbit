import React from 'react'
import { view, observable, IS_ELECTRON } from '@jot/black'

type Props = {
  router?: { path: string, go: Function },
}

@view
export default class Link {
  props: Props

  @observable isActive = false

  componentDidMount() {
    this.watch(() => {
      const isActive =
        this.props.router.path === this.props.to ||
        this.props.router.path === this.props.match
      this.ref('isActive').set(isActive)
    })
  }

  onClick = (e: Event) => {
    e.preventDefault()
    this.props.router.go(this.props.to)
    if (this.props.onClick) {
      this.props.onClick(e)
    }
  }

  render({ to, match, highlight, active, ...props }) {
    return (
      <a
        href={to}
        onDragStart={e => e.preventDefault()}
        onClick={this.onClick}
        {...props}
        $active={this.isActive}
      />
    )
  }

  static style = {
    a: {
      cursor: IS_ELECTRON ? 'default' : 'pointer',
    },
  }

  static theme = {
    active: ({ active }) => ({ active }),
  }
}
