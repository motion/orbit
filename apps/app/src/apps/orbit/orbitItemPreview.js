import { view } from '@mcro/black'
import * as UI from '@mcro/ui'

// const SubTitle = p => (
//   <UI.Text
//     size={0.9}
//     css={{ textTransform: 'uppercase', opacity: 0.4, margin: [5, 0] }}
//     {...p}
//   />
// )
// const P = p => (
//   <UI.Text
//     size={1.15}
//     css={{ marginBottom: 5, opacity: 0.65 }}
//     highlightWords={['ipsum', 'adipisicing', 'something']}
//     {...p}
//   />
// )

@view
export default class OrbitItemPreview {
  render({ result, background }) {
    if (!result) {
      return null
    }
    return (
      <div $$flex result={result}>
        <words>
          <UI.Text opacity={0.5} margin={[3, 0, 6]} size={0.95} ellipse>
            {result.subtitle || 'Created Jan 24th'}
          </UI.Text>
          <UI.Text if={result.body} ellipse>
            {result.body}
          </UI.Text>
          <fadeEnd
            if={false && result.body}
            css={{
              background: `linear-gradient(transparent 30%, ${background} 50%)`,
            }}
          />
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
