import { view } from '@mcro/black'
import * as UI from '@mcro/ui'
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

@view
export default class Item {
  render({ orbitStore, index, result, ...props }) {
    const isSelected = orbitStore.selectedIndex === index
    return (
      <UI.Surface
        background="transparent"
        glow={false}
        background={isSelected ? '#102945' : 'transparent'}
        hover={{
          background: isSelected ? '#102945' : [255, 255, 255, 0.04],
        }}
        glow={isSelected}
        glowProps={glowProps}
        padding={[10, 18]}
        onClick={orbitStore.selectItem(index)}
        {...props}
      >
        <UI.Title
          size={1.6}
          ellipse
          css={{ alignItems: 'center', justifyContent: 'center' }}
        >
          <OrbitIcon
            icon={result.icon ? `/icons/${result.icon}` : result.type}
            css={{
              width: 22,
              height: 22,
              marginRight: 3,
              marginBottom: 4,
              display: 'inline-block',
            }}
          />{' '}
          {result.title}
        </UI.Title>
        <UI.Text opacity={0.6} margin={[0, 0, 3]} size={1.1}>
          {result.subtitle}
        </UI.Text>
        <UI.Text opacity={0.8} ellipse={3} sizeLineHeight={1.15}>
          {result.content}
        </UI.Text>
      </UI.Surface>
    )
  }
}
