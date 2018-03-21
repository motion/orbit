import { view } from '@mcro/black'
import * as Helpers from '~/helpers'
import * as UI from '@mcro/ui'
import { App, Desktop, Electron } from '@mcro/all'
import OrbitItem from './orbitItem'
import { whenAsync } from 'mobx-utils'

const getKey = result => result.index || result.id || result.title

const getHoverProps = Helpers.hoverSettler({
  enterDelay: 600,
  onHovered: async target => {
    if (!target) {
      // hide
      await whenAsync(() => !Electron.isMouseInActiveArea)
      console.log('CLEAR hoverSettler')
      App.setPeekTarget(null)
      return
    }
    const { id, top, left, width, height } = target
    const position = {
      // add orbits offset
      left: left + Electron.orbitState.position[0],
      top: top + Electron.orbitState.position[1],
      width,
      height,
    }
    App.setPeekTarget({ id, position })
  },
})

const refs = {}

@view.attach('orbitStore')
@view
export default class OrbitContent {
  componentDidMount() {
    // this.react(
    //   () => this.props.orbitStore.selectedIndex,
    //   index => {
    //     console.log('selected index', index, refs[index])
    //   },
    // )
  }

  onRef = index => ref => {
    refs[index] = ref
  }

  render({ orbitStore }) {
    const { appState } = Desktop.state
    return (
      <list>
        <UI.Text if={App.isAttachedToWindow && appState} css={{ padding: 10 }}>
          {orbitStore.indexingStatus}
          <UI.Text
            if={appState.title}
            css={{ display: 'inline', opacity: 0.5, fontSize: '80%' }}
          >
            took {orbitStore.searchPerformance}
          </UI.Text>
        </UI.Text>
        {orbitStore.results.map((result, index) => (
          <OrbitItem
            key={getKey(result) || index}
            ref={this.onRef(index)}
            type="gmail"
            orbitStore={orbitStore}
            index={index}
            result={result}
            {...getHoverProps({
              result,
              id: index,
            })}
          />
        ))}
      </list>
    )
  }

  static style = {
    list: {
      flex: 1,
      overflowY: 'scroll',
    },
  }
}
