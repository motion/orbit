import * as React from 'react'
import { view } from '@mcro/black'
import { OrbitCard } from '../../../../views/OrbitCard'
import { SettingRepository } from '../../../../repositories'
import { SettingInfoStore } from '../../../../stores/SettingInfoStore'
import { Setting } from '@mcro/models'
import { OrbitCardProps } from '../../../../views/OrbitCard'
import pluralize from 'pluralize'

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
      const setting: Setting = {} as Setting
      setting.category = 'integration'
      setting.type = result.type
      setting.token = 'good'
      await SettingRepository.save(setting)
    }
  }

  render() {
    const { store, result, isActive, subtitle, onClick, ...props } = this.props
    const countSubtitle = !isActive
      ? ''
      : store.bitsCount === null
        ? '...'
        : `${store.bitsCount}`
    const subtitleDisplay = subtitle || countSubtitle
    return (
      <OrbitCard
        inactive={!isActive}
        title={result.title}
        subtitle={subtitleDisplay}
        subtitleProps={{
          size: 2,
          fontWeight: 500,
        }}
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
