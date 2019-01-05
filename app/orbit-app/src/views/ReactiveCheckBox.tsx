import * as React from 'react'
import { view } from '@mcro/black'
import { gloss } from '@mcro/gloss'

type Props = {
  isActive?: () => boolean
  onChange?: (nextValue: boolean, event: React.ChangeEvent<HTMLInputElement>) => void
  [key: string]: any
}

export const CheckBox = gloss({
  margin: 'auto',
})

CheckBox.defaultProps = {
  tagName: 'input',
  type: 'checkbox',
}

const preventClick = e => {
  e.preventDefault()
  e.stopPropagation()
}

@view
export class ReactiveCheckBox extends React.Component<Props> {
  onChange = e => {
    this.props.onChange(!this.props.isActive, e)
  }

  render() {
    const { isActive, onChange, ...props } = this.props
    return (
      <input
        style={{ margin: 'auto' }}
        type="checkbox"
        onChange={this.onChange}
        defaultChecked={isActive()}
        onMouseDown={preventClick}
        {...props}
      />
    )
  }
}
