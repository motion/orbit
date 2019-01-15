import * as React from 'react'
import { gloss } from '@mcro/gloss'
import { observer } from 'mobx-react-lite'

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

export default observer(function ReactiveCheckBox(props: Props) {
  const { isActive, onChange, ...rest } = props
  const handleOnChange = React.useCallback(
    e => {
      onChange(!props.isActive, e)
    },
    [props.isActive],
  )
  return (
    <input
      style={{ margin: 'auto' }}
      type="checkbox"
      onChange={handleOnChange}
      defaultChecked={isActive()}
      onMouseDown={preventClick}
      {...rest}
    />
  )
})
