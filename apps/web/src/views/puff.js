import { view, observable } from 'helpers'

const TOTAL_TIME = 200
const FRAMES = 4
const HEIGHT = 200 / FRAMES

@view
export default class Puff {
  @observable puff = true
  @observable iter = 0

  componentDidMount() {
    this.setTimeout(() => {
      this.puff = false
    }, TOTAL_TIME)

    this.setInterval(() => {
      this.iter++
    }, TOTAL_TIME / FRAMES)
  }

  render() {
    return <puff $iter={this.iter} if={this.puff} />
  }

  static style = {
    puff: {
      width: 48,
      height: HEIGHT,
      background: 'url(puff.png)',
    },

    iter: y => ({
      backgroundPosition: `0 -${y * HEIGHT}px`,
    }),
  }
}
