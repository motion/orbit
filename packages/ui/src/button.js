// @flow
import React from 'react'
import Surface from './surface'

export default class Button extends React.Component {
  render() {
    return <Surface tagName="button" glow {...this.props} noElement />
  }
}
