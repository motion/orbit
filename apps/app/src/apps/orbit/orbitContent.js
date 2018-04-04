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
    const { indexStatus, performance } = Desktop.searchState
    const { appState } = Desktop
    return (
      <UI.Text
        if={App.isAttachedToWindow && appState && (indexStatus || performance)}
        css={{ padding: 10 }}
      >
        {indexStatus}
        <UI.Text
          if={performance && appState.title}
          css={{ display: 'inline', opacity: 0.5, fontSize: '80%' }}
        >
          took {performance}
        </UI.Text>
      </UI.Text>
    )
  }
}

@view.attach('appStore')
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
    enterDelay: 200,
    onHovered: async target => {
      clearTimeout(this.updateTargetTm)
      if (!target) {
        // hide
        await whenAsync(() => !Electron.isMouseInActiveArea)
        await Helpers.sleep(50)
        if (!Electron.isMouseInActiveArea) {
          App.setPeekTarget(null)
        }
        return
      }
      const { id, top, width, height } = target
      const position = {
        // add orbits offset
        left: Electron.orbitState.position[0],
        top: top + Electron.orbitState.position[1],
        width,
        height,
      }
      if (App.isShowingOrbit) {
        this.props.appStore.setSelectedIndex(target.id)
        this.updateTargetTm = setTimeout(() => {
          App.setPeekTarget({ id, position, type: 'document' })
        }, 200)
      }
    },
  })

  render({ appStore }) {
    return (
      <list>
        <OrbitStatus />
        {appStore.results.map((result, index) => (
          <OrbitItem
            key={getKey(result) || index}
            ref={this.onRef(index)}
            type="gmail"
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
