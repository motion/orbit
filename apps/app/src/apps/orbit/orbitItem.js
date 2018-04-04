import { view } from '@mcro/black'
import { Title, Text, Surface } from '@mcro/ui'
import OrbitIcon from './orbitIcon'
import OrbitItemPreview from './orbitItemPreview'

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

@view.attach('appStore', 'orbitPage')
@view
export default class Item {
  onClick = () => {
    this.props.appStore.setSelectedIndex(this.props.index)
  }

  render({ appStore, orbitPage, index, result, total, ...props }) {
    const isSelected = appStore.selectedIndex === index
    // log(`OrbitItem isSelected ${isSelected} ${index}`)
    if (!result) {
      return null
    }
    const orbitHeight = orbitPage.contentHeight
    const WORDS_PER_LINE_ROUGHLY = 30
    const LINE_HEIGHT = 20
    const TITLE_HEIGHT = Math.ceil(result.title.length / 20) * LINE_HEIGHT * 3
    const maxItemHeight =
      TITLE_HEIGHT +
      LINE_HEIGHT * Math.ceil(result.body.length / WORDS_PER_LINE_ROUGHLY)
    const MAX_PER_SCREEN = 4
    const height = Math.min(
      maxItemHeight,
      Math.round(Math.max(orbitHeight / MAX_PER_SCREEN, orbitHeight / total)),
    )
    return (
      <Surface
        background="transparent"
        glow={false}
        background={isSelected ? [255, 255, 255, 0.5] : 'transparent'}
        glowProps={glowProps}
        padding={15}
        onClick={this.onClick}
        borderWidth={0}
        height={height}
        {...props}
      >
        <titles>
          <Title
            size={1.3}
            sizeLineHeight={1}
            ellipse={2}
            css={{
              fontWeight: 400,
              width: 'calc(100% - 15px)',
              // letterSpacing: isSelected ? -0.25 : 0,
              opacity: isSelected ? 1 : 0.95,
              // alignItems: 'center',
              // justifyContent: 'center',
              textShadow: isSelected ? `0 0 5px rgba(255,255,255,0.3)` : 'none',
            }}
          >
            {result.title}
          </Title>
          <OrbitIcon
            icon={result.icon ? `/icons/${result.icon}` : result.integration}
            size={18}
            css={{
              marginLeft: 0,
              marginTop: 3,
            }}
          />
        </titles>
        <OrbitItemPreview result={result} />
      </Surface>
    )
  }

  static style = {
    space: {
      height: 20,
    },
    titles: {
      flexFlow: 'row',
      alignItems: 'flex-start',
      padding: [2, 5, 2, 0],
    },
  }
}
