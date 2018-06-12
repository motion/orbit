import * as React from 'react'
import { view } from '@mcro/black'
import * as UI from '@mcro/ui'
import { OrbitCard } from '~/apps/orbit/orbitCard'

@view.attach('appStore')
@view
export class OrbitSettingCard extends React.Component {
  render({ result, setting, isActive, appStore, ...props }) {
    const { id, icon, title } = result
    return (
      <OrbitCard
        inactive={!isActive}
        $card
        $isActive={isActive}
        onClick={
          !isActive &&
          (async () => {
            if (result.oauth === false) {
              setting.token = 'good'
              await setting.save()
              appStore.getSettings()
            } else {
              appStore.startOauth(id)
            }
            return
          })
        }
        title={title}
        afterTitle={
          <>
            <React.Fragment if={!isActive}>
              <UI.Button>Add</UI.Button>
            </React.Fragment>
            <React.Fragment if={isActive}>
              <UI.Button>Remove</UI.Button>
            </React.Fragment>
          </>
        }
        icon={icon}
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
