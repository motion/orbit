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
    highlightWords={['ipsum', 'adipisicing', 'something']}
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
    if (!result) {
      return null
    }
    return (
      <Surface
        background="transparent"
        glow={false}
        background={isSelected ? [255, 255, 255, 0.6] : 'transparent'}
        glowProps={glowProps}
        padding={[16, 11]}
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
            size={16}
            css={{
              marginRight: 3,
              marginBottom: 4,
              display: 'inline-block',
            }}
          />{' '}
          {result.title}
        </Title>
        <Text opacity={0.5} margin={[3, 0, 6]} size={0.95} ellipse>
          {result.subtitle || 'Created Jan 24th'}
        </Text>
        <Text size={1} sizeLineHeight={1.15}>
          <SubTitle if={false}>Section 1</SubTitle>
          <P selectable ellipse={4}>
            {result.body || 'Lorem Ipsum dolor sit amet'}
          </P>
        </Text>
      </Surface>
    )
  }
}
