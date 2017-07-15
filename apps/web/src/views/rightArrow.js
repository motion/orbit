import { view } from '@mcro/black'
import * as UI from '@mcro/ui'

@view({
  store: class {
    rendered = false

    start() {
      setTimeout(() => (this.rendered = true), 0)
    }
  },
})
export default class RightArrow {
  render({ store, animate, ...props }) {
    return (
      <arrow {...props}>
        <UI.Icon
          $animate={animate}
          $animateAfter={animate && store.rendered}
          $icon
          size={10}
          name="arrow-min-right"
        />
      </arrow>
    )
  }

  static style = {
    arrow: {
      margin: ['auto', 0],
    },
    icon: {
      margin: ['auto', 0],
    },
    animate: {
      transition: 'all 100ms ease-in',
      transform: 'scale(0) translateX(-5px)',
      opacity: 0.2,
    },
    animateAfter: {
      opacity: 1,
      transform: 'scale(1) translateX(0px)',
    },
  }
}
