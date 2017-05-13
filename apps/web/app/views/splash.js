import { view } from '~/helpers'
import Rx from 'rxjs'

@view
export default class Splash {
  time = Rx.Observable.timer(0, 16).take(30000)

  render() {
    return <loader $$draggable $at={this.time} />
  }

  static style = {
    loader: {
      width: '100%',
      height: '100%',
      // backgroundImage: 'url(https://grasshoppermind.files.wordpress.com/2012/05/five-lined-pyramids.jpg)',
      backgroundPosition: 'center center',
      backgroundSize: 'cover',
      filter: 'contrast(100%) brightness(1)',
    },
    at: time => ({
      filter: `contrast(${100 + time * 2}%) brightness(${1 + 0.1 * time})`,
    }),
  }
}
