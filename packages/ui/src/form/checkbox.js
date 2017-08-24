import { view } from '@mcro/black'
import { observable } from 'mobx'
import SizedSurface from '../sizedSurface'

@view
export default class Checkbox {
  @observable isChecked = this.props.defaultValue || false

  onChange = (e: Event) => {
    this.isChecked = e.target.checked
    return this.isChecked
  }

  render({ onChange, sync, ...props }) {
    const { isChecked } = this
    return (
      <SizedSurface
        margin={[0, 3]}
        background={isChecked ? 'rgb(92, 107, 123)' : '#f2f2f2'}
        color={isChecked ? '#fff' : '#ddd'}
        hoverColor={isChecked ? '#fff' : '#ddd'}
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
        <input type="checkbox" onChange={this.onChange} />
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
