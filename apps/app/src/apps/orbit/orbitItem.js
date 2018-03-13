import { view } from '@mcro/black'
import * as UI from '@mcro/ui'
import OrbitIcon from './orbitIcon'

@view
export default class Item {
  render({ orbitStore, index, title, type, subtitle, content, ...props }) {
    return (
      <UI.Surface
        background="transparent"
        glow
        background={
          orbitStore.selectedIndex === index ? '#0364E4' : 'transparent'
        }
        glowProps={{
          color: '#fff',
          scale: 1,
          blur: 70,
          opacity: 0.15,
          show: false,
          resist: 60,
          zIndex: -1,
        }}
        padding={[10, 18]}
        {...props}
      >
        <UI.Title
          size={1.6}
          ellipse
          css={{ alignItems: 'center', justifyContent: 'center' }}
        >
          <OrbitIcon
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
  }
}
