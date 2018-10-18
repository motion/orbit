import * as React from 'react'
import { view, compose } from '@mcro/black'
import { OrbitCard } from '../../../../views/OrbitCard'
import { AppInfoStore, AppInfoProps } from '../../../../stores/AppInfoStore'
import { OrbitItemProps } from '../../../../views/OrbitItemProps'
import { SyncStatus } from './SyncStatus'
import { Text } from '@mcro/ui'
import { Setting } from '@mcro/models'

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
  ({ store, model, appConfig, isActive, subtitle, ...props }: Props) => {
    const countSubtitle = store.bitsCount >= 0 ? Number(store.bitsCount).toLocaleString() : '...'
    return (
      <OrbitCard
        direct
        title={appConfig.title}
        titleProps={{
          ellipse: true,
        }}
        subtitle={typeof subtitle !== 'undefined' ? subtitle : countSubtitle}
        subtitleProps={{
          size: 1.5,
          fontWeight: 300,
        }}
        titleFlex={1}
        date={store.job && store.job.updatedAt}
        icon={appConfig.integration}
        iconProps={{
          size: 20,
        }}
        {...props}
      >
        <SyncStatus settingId={model.id}>
          {(syncJobs, removeJobs) => {
            return (
              <Text size={0.85} alpha={0.6}>
                {syncJobs.length ? 'Syncing' : removeJobs.length ? 'Removing' : ''}
              </Text>
            )
          }}
        </SyncStatus>
      </OrbitCard>
    )
  },
)
