import * as React from 'react'
import { view } from '@mcro/black'
// import * as UI from '@mcro/ui'
import { OrbitCard } from '../../apps/orbit/OrbitCard'
import { SettingInfoStore } from '../../stores/SettingInfoStore'
import { Setting } from '@mcro/models'
import { OrbitCardProps } from './OrbitCard'
import { App } from '@mcro/stores'

@view.attach('appStore')
@view.attach({
  store: SettingInfoStore,
})
@view
export class OrbitSettingCard extends React.Component<
  OrbitCardProps & {
    store: SettingInfoStore
    isActive?: boolean
  }
> {
  handleClick = async () => {
    const { result } = this.props
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
      console.log('result', result)
      App.actions.startOauth(result.id)
    }
    return
  }

  render() {
    const { store, result, isActive, subtitle, onClick, ...props } = this.props
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
            alpha: 0.8,
          }
        }
        result={result}
        {...props}
        onClick={onClick || (!isActive ? this.handleClick : null)}
      />
    )
  }
}
