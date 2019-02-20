import { gloss } from '@mcro/gloss'
import { useReaction } from '@mcro/use-store'
import * as React from 'react'

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

export function CheckboxReactive(props: Props) {
  const { isActive, onChange, ...rest } = props
  const checked = useReaction(() => isActive())

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
      defaultChecked={checked}
      onMouseDown={preventClick}
      {...rest}
    />
  )
}
