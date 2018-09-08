import * as React from 'react'
import { view } from '@mcro/black'

type Props = {
  isActive?: () => boolean
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void
  [key: string]: any
}

const preventClick = e => {
  console.log('stop it')
  e.preventDefault()
  e.stopPropagation()
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
        onMouseDown={preventClick}
        {...props}
      />
    )
  }
}
