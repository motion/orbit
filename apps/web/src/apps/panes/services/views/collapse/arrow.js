import { view } from '@mcro/black'
import * as UI from '@mcro/ui'

@view
export default class CollapseArrow {
  render({ open, iconSize }) {
    return (
      <UI.Icon
        color="#333"
        name="arrows-1_small-triangle-right"
        size={iconSize || 24}
        $arrow
        $flip={open}
      />
    )
  }

  static style = {
    arrow: {
      transition: 'transform ease-in 100ms',
      marginRight: 3,
    },
    flip: {
      transform: { rotate: '90deg' },
    },
  }
}
