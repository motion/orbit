import * as React from 'react'
import { view } from '@mcro/black'
import { observable } from 'mobx'
import { SizedSurface } from '../SizedSurface'

@view
export class Checkbox extends React.Component {
  @observable isChecked = this.props.defaultValue || false

  onChange = e => {
    this.isChecked = e.target.checked
    return this.isChecked
  }

  render({ onChange, sync, hover, ...props }) {
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
        flex={false}
        hover={{
          color: isChecked ? '#fff' : '#ddd',
          ...hover,
        }}
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
        <input $input type="checkbox" onChange={this.onChange} />
      </SizedSurface>
    )
  }

  static style = {
    input: {
      position: 'absolute',
      opacity: 0.0001,
      transform: {
        scale: 2,
        x: '-33%',
        y: '-60%',
      },
    },
  }
}
