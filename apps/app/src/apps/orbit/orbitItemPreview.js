import { view } from '@mcro/black'
import * as UI from '@mcro/ui'

const SubTitle = p => (
  <UI.Text
    size={0.9}
    css={{ textTransform: 'uppercase', opacity: 0.4, margin: [5, 0] }}
    {...p}
  />
)
const P = p => (
  <UI.Text
    size={1.15}
    css={{ marginBottom: 5, opacity: 0.85 }}
    highlightWords={['ipsum', 'adipisicing', 'something']}
    {...p}
  />
)

@view
export default class OrbitItemPreview {
  render({ result }) {
    if (!result) {
      return null
    }
    return (
      <div $$flex result={result}>
        <UI.Text opacity={0.5} margin={[3, 0, 6]} size={0.95} ellipse>
          {result.subtitle || 'Created Jan 24th'}
        </UI.Text>
        <UI.Text size={1} sizeLineHeight={1.15}>
          <SubTitle if={false}>Section 1</SubTitle>
          <P ellipse={4}>{result.body || 'Lorem Ipsum dolor sit amet'}</P>
          <space />
          <P ellipse={4}>{result.body || 'Lorem Ipsum dolor sit amet'}</P>
        </UI.Text>
      </div>
    )
  }
  static style = {
    space: {
      height: '1rem',
    },
  }
}
