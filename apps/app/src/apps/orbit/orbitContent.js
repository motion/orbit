import { view } from '@mcro/black'
import * as Helpers from '~/helpers'
import { App, Electron } from '@mcro/all'
import OrbitItem from './orbitItem'

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

@view.attach('orbitStore')
@view
export default class OrbitContent {
  render({ orbitStore }) {
    return (
      <list>
        {orbitStore.results.map((result, index) => (
          <OrbitItem
            key={result.index || result.id || result.title || index}
            type="gmail"
            orbitStore={orbitStore}
            index={index}
            result={result}
            {...getHoverProps({
              result,
              id: result.index,
            })}
          />
        ))}
      </list>
    )
  }
}
