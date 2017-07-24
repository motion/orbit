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
    return <arrow {...props}>/</arrow>
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
