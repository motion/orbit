import * as React from 'react'
import { view } from '@mcro/black'
import { observable } from 'mobx'
import { SizedSurface } from '../SizedSurface'

const HiddenInput = view({
  position: 'absolute',
  opacity: 0.0001,
  transform: {
    scale: 2,
    x: '-33%',
    y: '-60%',
  },
})

type Props = {
  defaultValue?: any
  onChange?: Function
  sync?: any
}

@view
export class Checkbox extends React.Component<Props> {
  @observable isChecked = this.props.defaultValue || false

  onChange = e => {
    this.isChecked = e.target.checked
    return this.isChecked
  }

  render() {
    const { onChange, sync, ...props } = this.props
    const { isChecked } = this
    return (
      <SizedSurface
        margin={[0, 3]}
        background={isChecked ? 'rgb(92, 107, 123)' : '#f2f2f2'}
        color={isChecked ? '#fff' : '#ddd'}
        borderRadius={6}
        borderWidth={1}
        borderColor={isChecked ? 'rgb(92, 107, 123)' : '#ccc'}
        icon={isChecked ? 'check-simple' : 'check-simple'}
        iconSize={12}
        glow={false}
        padding={2}
        height={18}
        align="center"
        justify="center"
        flex={0}
        iconProps={{
          css: {
            opacity: isChecked ? 1 : 0,
            transform: {
              y: 1,
              scale: isChecked ? 1 : 1,
            },
          },
        }}
        {...props}
      >
        <HiddenInput type="checkbox" onChange={this.onChange} />
      </SizedSurface>
    )
  }
}
