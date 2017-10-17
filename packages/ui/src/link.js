// @flow
import * as React from 'react'
import { view, Constants } from '@mcro/black'

type Props = {
  router?: { path: string, go: Function },
}

@view
export default class Link extends React.Component<Props> {
  isActive = false

  componentDidMount() {
    this.watch(() => {
      const isActive =
        this.props.router.path === this.props.to ||
        this.props.router.path === this.props.match
      this.isActive = isActive
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
      cursor: Constants.IS_ELECTRON ? 'default' : 'pointer',
    },
  }

  static theme = {
    active: ({ active }) => ({ active }),
  }
}
