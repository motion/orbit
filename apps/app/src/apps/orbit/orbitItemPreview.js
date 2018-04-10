import { view } from '@mcro/black'
import * as UI from '@mcro/ui'

@view
export default class OrbitItemPreview {
  render({ result }) {
    if (!result) {
      return null
    }
    return (
      <div $$flex result={result}>
        <words>
          <UI.Text opacity={0.5} margin={[3, 0, 6]} size={0.95} ellipse={1}>
            {result.subtitle || 'Created Jan 24th'}
          </UI.Text>
          <UI.Text if={result.body} ellipse>
            {result.body}
          </UI.Text>
        </words>
      </div>
    )
  }
  static style = {
    space: {
      height: '1rem',
    },
    words: {
      // background: 'red',
      // fontSize: 15,
      // lineHeight: '33px',
    },
    fadeEnd: {
      position: 'absolute',
      left: 0,
      bottom: 0,
      right: 0,
      height: 50,
      zIndex: 100,
      pointerEvents: 'none',
    },
  }
}
