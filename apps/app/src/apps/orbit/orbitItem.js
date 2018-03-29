import { view } from '@mcro/black'
import { Title, Text, Surface } from '@mcro/ui'
import OrbitIcon from './orbitIcon'

const glowProps = {
  color: '#fff',
  scale: 1,
  blur: 70,
  opacity: 0.15,
  show: false,
  resist: 60,
  zIndex: -1,
}

const SubTitle = p => (
  <Text
    size={0.9}
    css={{ textTransform: 'uppercase', opacity: 0.4, margin: [5, 0] }}
    {...p}
  />
)
const P = p => (
  <Text
    size={1.15}
    css={{ marginBottom: 5, opacity: 0.85 }}
    highlightWords={['Lorem', 'ipsum', 'adipisicing']}
    {...p}
  />
)

@view.attach('appStore')
@view
export default class Item {
  onClick = () => {
    this.props.appStore.setSelectedIndex(this.props.index)
  }

  render({ appStore, index, result, ...props }) {
    const isSelected = appStore.selectedIndex === index
    // log(`OrbitItem isSelected ${isSelected} ${index}`)
    return (
      <Surface
        background="transparent"
        glow={false}
        background={isSelected ? [255, 255, 255, 0.25] : 'transparent'}
        glowProps={glowProps}
        padding={[10, 11]}
        onClick={this.onClick}
        {...props}
      >
        <Title
          size={1.6}
          ellipse
          css={{
            fontWeight: 300,
            // letterSpacing: isSelected ? -0.25 : 0,
            opacity: isSelected ? 1 : 0.95,
            alignItems: 'center',
            justifyContent: 'center',
            textShadow: isSelected ? `0 0 5px rgba(255,255,255,0.3)` : 'none',
          }}
        >
          <OrbitIcon
            icon={result.icon ? `/icons/${result.icon}` : result.integration}
            css={{
              width: 22,
              height: 22,
              marginRight: 3,
              marginBottom: 4,
              display: 'inline-block',
            }}
          />{' '}
          {result.title}
        </Title>
        <Text opacity={0.5} margin={[0, 0, 3]} size={0.95} ellipse>
          {result.subtitle || ''}
        </Text>
        <Text size={1} sizeLineHeight={1.15}>
          <SubTitle if={false}>Section 1</SubTitle>
          <P selectable>{result.sentence || ''}</P>
        </Text>
      </Surface>
    )
  }
}
