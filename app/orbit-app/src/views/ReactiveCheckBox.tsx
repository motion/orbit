import * as React from 'react'
import { view } from '@mcro/black'

type Props = {
  isActive?: () => boolean
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void
  [key: string]: any
}

@view
export class ReactiveCheckBox extends React.Component<Props> {
  render() {
    const { isActive, onChange, ...props } = this.props
    return (
      <input
        style={{ margin: 'auto' }}
        type="checkbox"
        onChange={onChange}
        defaultChecked={isActive()}
        {...props}
      />
    )
  }
}
