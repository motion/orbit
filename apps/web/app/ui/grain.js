import { view } from '~/helpers'

@view.plain
export default class Grain {
  render() {
    return <grain $$fullscreen />
  }

  static style = {
    grain: {
      background: 'url(/images/grain.png)',
      zIndex: 0,
      opacity: 0.25,
      pointerEvents: 'none',
    },
  }
}
