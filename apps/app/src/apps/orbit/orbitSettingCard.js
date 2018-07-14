import * as React from 'react'
import { view } from '@mcro/black'
import * as UI from '@mcro/ui'
import { OrbitCard } from '../../apps/orbit/OrbitCard'
import { SettingInfoStore } from '../../stores/SettingInfoStore'
import * as OauthActions from '../../actions/OauthActions'
import { Setting } from '@mcro/models'

@view.attach('appStore')
@view.attach({
  store: SettingInfoStore,
})
@view
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

  render({ store, result, isActive, subtitle, ...props }) {
    const countSubtitle = !isActive
      ? ''
      : store.bitsCount === null
        ? '...'
        : `${store.bitsCount || '0'} total`
    const subtitleDisplay = subtitle || countSubtitle
    if (!result.title) {
      console.log('no title for', result)
      return null
    }
    return (
      <OrbitCard
        inactive={!isActive}
        title={result.title}
        subtitle={subtitleDisplay}
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
}
