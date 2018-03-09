import { view } from '@mcro/black'
import * as UI from '@mcro/ui'
import OrbitIcon from './orbitIcon'
import * as Helpers from '~/helpers'
import { App, Electron } from '@mcro/all'

const getHoverProps = Helpers.hoverSettler({
  enterDelay: 600,
  onHovered: target => {
    if (!target) {
      // hide
      App.setState({ peekTarget: null })
    }
    const { id, result, top, left, width, height } = target
    const position = {
      // add orbits offset
      left: left + Electron.orbitState.position[0],
      top: top + Electron.orbitState.position[1],
      width,
      height,
    }
    console.log('hovered', id, position, result)
    App.setState({ peekTarget: { id, position } })
  },
})

const Item = ({ title, type, subtitle, content, ...props }) => (
  <UI.Surface
    background="transparent"
    glow
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

@view.attach('orbitStore')
@view
export default class OrbitContent {
  render({ orbitStore }) {
    return (
      <content>
        <list>
          {orbitStore.results.map(result => (
            <Item
              type="gmail"
              title={result.document.title}
              subtitle={`distance: ${result.distance}`}
              content={result.sentence}
              {...getHoverProps({
                result,
                id: result.index,
              })}
            />
          ))}
        </list>
      </content>
    )
  }
}
