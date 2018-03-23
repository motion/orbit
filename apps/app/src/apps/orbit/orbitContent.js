import { view } from '@mcro/black'
import * as Helpers from '~/helpers'
import * as UI from '@mcro/ui'
import { App, Desktop, Electron } from '@mcro/all'
import OrbitItem from './orbitItem'
import { whenAsync } from 'mobx-utils'

const getKey = result => result.index || result.id || result.title

const refs = {}

@view
class OrbitStatus {
  render() {
    const { appState, searchIndexStatus, searchPerformance } = Desktop.state
    return (
      <UI.Text if={App.isAttachedToWindow && appState} css={{ padding: 10 }}>
        {searchIndexStatus}
        <UI.Text
          if={appState.title}
          css={{ display: 'inline', opacity: 0.5, fontSize: '80%' }}
        >
          took {searchPerformance}
        </UI.Text>
      </UI.Text>
    )
  }
}

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

  getHoverProps = Helpers.hoverSettler({
    enterDelay: 600,
    onHovered: async target => {
      clearTimeout(this.updateTargetTm)
      if (!target) {
        // hide
        await Helpers.sleep(50)
        await whenAsync(() => !Electron.isMouseInActiveArea)
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
      if (App.isShowingOrbit) {
        log(`set index ${target.id}`)
        this.props.orbitStore.setSelectedIndex(target.id)
        this.updateTargetTm = setTimeout(() => {
          log(`set target ${target.id}`)
          App.setPeekTarget({ id, position })
        }, 64)
      }
    },
  })

  render({ orbitStore }) {
    log(`OrbitContent`)
    return (
      <list>
        <OrbitStatus />
        {orbitStore.results.map((result, index) => (
          <OrbitItem
            key={getKey(result) || index}
            ref={this.onRef(index)}
            type="gmail"
            orbitStore={orbitStore}
            index={index}
            result={result}
            {...this.getHoverProps({
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
