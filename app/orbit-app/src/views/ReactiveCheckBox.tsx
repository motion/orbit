import * as React from 'react'
import { view } from '@mcro/black'

@view
export class ReactiveCheckBox extends React.Component<{
  isActive?: () => boolean
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void
}> {
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
