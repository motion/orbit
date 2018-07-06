import * as React from 'react'
import { view } from '@mcro/black'
import * as UI from '@mcro/ui'
import { OrbitCard } from '~/apps/orbit/orbitCard'
import { SettingInfoStore } from '~/stores/SettingInfoStore'
import * as OauthActions from '~/actions/OauthActions'
import { Setting } from '@mcro/models'

@view.attach('appStore')
@view({
  store: SettingInfoStore,
})
export class OrbitSettingCard extends React.Component {
  handleClick = async () => {
    const { isActive, result } = this.props
    if (isActive) {
      return
    }
    if (result.auth === false) {
      const setting = new Setting()
      setting.category = 'integration'
      setting.type = result.type
      setting.token = 'good'
      await setting.save()
    } else if (result.auth) {
      console.log('should select auth view')
      return
    } else {
      OauthActions.startOauth(result.id)
    }
    return
  }

  render({ store, result, isActive, setting, ...props }) {
    return (
      <OrbitCard
        inactive={!isActive}
        $card
        $isActive={isActive}
        title={result.title}
        subtitle={
          !isActive
            ? ''
            : store.bitsCount === null
              ? '...'
              : `${store.bitsCount || '0'} total`
        }
        date={store.job && store.job.updatedAt}
        icon={result.icon}
        iconProps={
          !isActive && {
            color: '#999',
            style: {
              opacity: 0.6,
            },
          }
        }
        result={result}
        onClick={this.handleClick}
        afterTitle={
          <after css={{ flexFlow: 'row', margin: [-5, 0] }}>
            <React.Fragment if={false && isActive}>
              <UI.Button>Remove</UI.Button>
            </React.Fragment>
          </after>
        }
        {...props}
      />
    )
  }

  static style = {
    icon: {
      margin: ['auto', 10, 'auto', -8],
      transform: {
        y: -1,
      },
    },
  }
}
