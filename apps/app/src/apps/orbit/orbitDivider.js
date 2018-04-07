import { view } from '@mcro/black'

@view
export default class OrbitDivider {
  render(props) {
    return (
      <barOuter {...props}>
        <bar />
      </barOuter>
    )
  }
  static style = {
    barOuter: {
      pointerEvents: 'all',
      margin: [0, 10],
      padding: 10,
      cursor: 'ns-resize',
      opacity: 0.25,
      zIndex: 10,
      '&:hover': {
        opacity: 0.5,
      },
    },
    bar: {
      flex: 1,
      height: 4,
      borderRadius: 100,
      background: [0, 0, 0, 0.1],
    },
  }
}
