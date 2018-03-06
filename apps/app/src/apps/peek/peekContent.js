import { view } from '@mcro/black'
import * as UI from '@mcro/ui'
import PeekIcon from './peekIcon'

const glowProps = {
  color: '#fff',
  scale: 1,
  blur: 70,
  opacity: 0.15,
  show: false,
  resist: 60,
  zIndex: -1,
}

const Item = ({ title, type, subtitle, content }) => (
  <UI.Surface
    background="transparent"
    glow
    glowProps={glowProps}
    padding={[10, 18]}
  >
    <UI.Title
      size={1.6}
      ellipse
      css={{ alignItems: 'center', justifyContent: 'center' }}
    >
      <PeekIcon
        name={type}
        css={{
          width: 22,
          height: 22,
          marginRight: 3,
          marginBottom: 4,
          display: 'inline-block',
        }}
      />{' '}
      {title}
    </UI.Title>
    <UI.Text opacity={0.6} margin={[0, 0, 3]} size={1.1}>
      {subtitle}
    </UI.Text>
    <UI.Text opacity={0.8} ellipse={3} sizeLineHeight={1.15}>
      {content}
    </UI.Text>
  </UI.Surface>
)

@view
export default class PeekContent {
  render({ store }) {
    return (
      <list>
        {store.results.map(result => (
          <Item
            type="gmail"
            title={result.item.title}
            subtitle="Uber Receipts"
            content={result.snippet}
          />
        ))}
      </list>
    )
  }
}
