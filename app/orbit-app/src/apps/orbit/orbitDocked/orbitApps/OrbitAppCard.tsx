import * as React from 'react'
import { view, compose } from '@mcro/black'
import { OrbitCard } from '../../../../views/OrbitCard'
import { AppInfoStore, AppInfoProps } from '../../../../stores/AppInfoStore'
import { OrbitItemProps } from '../../../../views/OrbitItemProps'
import { SyncStatus } from '../views/SyncStatus'
import { Text } from '@mcro/ui'
import { Setting } from '@mcro/models'
import { NICE_INTEGRATION_NAMES } from '../../../../constants'

type Props = OrbitItemProps<Setting> &
  AppInfoProps & {
    store: AppInfoStore
    isActive?: boolean
  }

const decorator = compose(
  view.attach({
    store: AppInfoStore,
  }),
  view,
)

export const OrbitAppCard = decorator(
  ({ settingId, store, model, isActive, subtitle, ...props }: Props) => {
    const countSubtitle = store.bitsCount >= 0 ? Number(store.bitsCount).toLocaleString() : '...'
    const subtitleDisplay = subtitle || countSubtitle
    return (
      <OrbitCard
        title={NICE_INTEGRATION_NAMES[model.type]}
        titleProps={{
          ellipse: true,
        }}
        subtitle={subtitleDisplay}
        subtitleProps={{
          size: 1.5,
          fontWeight: 300,
        }}
        titleFlex={1}
        date={store.job && store.job.updatedAt}
        icon={model.type}
        iconProps={{
          size: 20,
        }}
        padding={8}
        result={model}
        {...props}
      >
        <SyncStatus settingId={settingId}>
          {jobs => {
            return (
              <Text size={0.9} alpha={0.6}>
                {jobs ? 'Syncing' : 'Ready'}
              </Text>
            )
          }}
        </SyncStatus>
      </OrbitCard>
    )
  },
)
