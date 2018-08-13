import * as React from 'react'
import { view, compose } from '@mcro/black'
import { OrbitCard } from '../../../../views/OrbitCard'
import { SettingRepository } from '../../../../repositories'
import { SettingInfoStore } from '../../../../stores/SettingInfoStore'
import { Setting } from '@mcro/models'
import { OrbitCardProps } from '../../../../views/OrbitCard'

const handleClick = async () => {
  const { result } = this.props
  if (result.auth === false) {
    const setting: Setting = {} as Setting
    setting.category = 'integration'
    setting.type = result.type
    setting.token = 'good'
    await SettingRepository.save(setting)
  }
}

type Props = OrbitCardProps & {
  store: SettingInfoStore
  isActive?: boolean
}

const decorator = compose(
  view.attach({
    store: SettingInfoStore,
  }),
  view,
)
export const OrbitSettingCard = decorator(
  ({ store, result, isActive, subtitle, onClick, ...props }: Props) => {
    const countSubtitle = !isActive
      ? ''
      : store.bitsCount >= 0
        ? `${store.bitsCount}`
        : '...'
    const subtitleDisplay = subtitle || countSubtitle
    return (
      <OrbitCard
        inactive={!isActive}
        title={result.title}
        titleProps={{
          ellipse: true,
        }}
        subtitle={subtitleDisplay}
        subtitleProps={{
          size: 1.75,
          fontWeight: 500,
        }}
        date={store.job && store.job.updatedAt}
        icon={result.icon}
        iconProps={{
          size: 20,
        }}
        result={result}
        {...props}
        onClick={onClick || (!isActive ? handleClick : null)}
      />
    )
  },
)
