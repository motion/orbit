import * as React from 'react'
import { view } from '@mcro/black'

@view
export class ReactiveCheckBox extends React.Component {
  render() {
    const { isActive, onChange } = this.props
    return (
      <input
        style={{ margin: 'auto' }}
        type="checkbox"
        onChange={onChange}
        defaultChecked={isActive()}
      />
    )
  }
}
