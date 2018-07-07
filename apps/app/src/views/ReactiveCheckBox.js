import * as React from 'react'
import { view } from '@mcro/black'

@view
export class ReactiveCheckBox extends React.Component {
  render({ isActive, onChange }) {
    return (
      <input type="checkbox" onChange={onChange} defaultChecked={isActive()} />
    )
  }
  static style = {
    input: {
      margin: 'auto',
    },
  }
}
