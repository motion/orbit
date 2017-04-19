import { view, observable } from 'helpers'

const TOTAL_TIME = 200
const FRAMES = 5
const HEIGHT = 240 / FRAMES

@view
export default class Poof {
  static defaultProps = {
    top: 0,
    left: 0,
  }

  @observable show = true
  @observable iter = 0

  componentDidMount() {
    this.setTimeout(() => {
      this.show = false
    }, TOTAL_TIME)

    this.setInterval(() => {
      this.iter = (this.iter + 1) % FRAMES
    }, TOTAL_TIME / FRAMES)
  }

  render({ top, left }) {
    return <poof if={this.show} $$top={top} $$left={left} $iter={this.iter} />
  }

  static style = {
    poof: {
      width: 48,
      height: HEIGHT,
      marginTop: -HEIGHT / 2,
      marginLeft: -48 / 2,
      position: 'absolute',
      backgroundImage: 'url(poof.png)',
      backgroundRepeat: 'no-repeat',
    },

    iter: y => ({
      backgroundPosition: `0 -${y * HEIGHT}px`,
    }),
  }
}
