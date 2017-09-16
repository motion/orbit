import { view } from '@mcro/black'

const labelColors = {
  bug: 'red',
  duplicate: 'gray',
  'help wanted': 'green',
  question: 'purple',
  enhancement: 'blue',
}

@view
export default class ColorBlock {
  render({ id, size = 20 }) {
    return (
      <color
        style={{
          width: size,
          height: size,
          background: labelColors[id] || 'gray',
        }}
      />
    )
  }

  static style = {
    color: {
      borderRadius: 5,
    },
  }
}
