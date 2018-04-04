import { view } from '@mcro/black'
import * as UI from '@mcro/ui'
import { App, Desktop, Electron } from '@mcro/all'
import OrbitItem from './orbitItem'

const getKey = result => result.index || result.id || result.title

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
  render({ appStore, getHoverProps, onRef }) {
    return (
      <list>
        <OrbitStatus />
        {appStore.results.map((result, index) => (
          <OrbitItem
            key={getKey(result) || index}
            ref={onRef(index)}
            type="gmail"
            index={index}
            result={result}
            total={appStore.results.length}
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
