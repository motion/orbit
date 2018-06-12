import * as React from 'react'
import { view } from '@mcro/black'
import * as UI from '@mcro/ui'
import { OrbitCard } from '~/apps/orbit/orbitCard'
import { SettingInfoStore } from '~/stores/SettingInfoStore'

@view.attach('appStore')
@view({
  store: SettingInfoStore,
})
export class OrbitSettingCard extends React.Component {
  componentWillMount() {
    this.props.store.setBit(this.props.result)
  }

  render({ store, result, setting, isActive, appStore, ...props }) {
    return (
      <OrbitCard
        inactive={!isActive}
        $card
        $isActive={isActive}
        title={result.title}
        subtitle={
          store.bitsCount === null
            ? '...'
            : `${store.bitsCount || 'none'} synced`
        }
        date={store.job && store.job.updatedAt}
        icon={result.icon}
        result={result}
        onClick={
          !isActive &&
          (async () => {
            if (result.oauth === false) {
              setting.token = 'good'
              await setting.save()
              appStore.updateSettings()
            } else {
              appStore.startOauth(result.id)
            }
            return
          })
        }
        afterTitle={
          <after css={{ flexFlow: 'row', margin: [-5, 0] }}>
            <React.Fragment if={!isActive}>
              <UI.Button>Add</UI.Button>
            </React.Fragment>
            <React.Fragment if={isActive}>
              <UI.Button>Remove</UI.Button>
            </React.Fragment>
          </after>
        }
        {...props}
      />
    )
  }

  static style = {
    card: {
      opacity: 0.7,
    },
    isActive: {
      opacity: 1,
    },
    icon: {
      margin: ['auto', 10, 'auto', -8],
      transform: {
        y: -1,
      },
    },
  }
}
