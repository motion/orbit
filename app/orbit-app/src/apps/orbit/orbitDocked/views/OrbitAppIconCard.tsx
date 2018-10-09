import * as React from 'react'
import { OrbitCard } from '../../../../views/OrbitCard'
import { AppInfoStore, AppInfoProps } from '../../../../stores/AppInfoStore'
import { OrbitItemProps } from '../../../../views/OrbitItemProps'
import { SyncStatus } from './SyncStatus'
import { Text } from '@mcro/ui'
import { Setting } from '@mcro/models'
import { OrbitIcon } from '../../../../views/OrbitIcon'
import { view } from '@mcro/black'
import { SHORT_INTEGRATION_NAMES } from '../../../../constants'

type Props = OrbitItemProps<Setting> &
  AppInfoProps & {
    store: AppInfoStore
    isActive?: boolean
  }

const Centered = view({
  flex: 1,
  alignItems: 'center',
  justifyContent: 'center',
})

export const OrbitAppIconCard = ({
  store,
  hideTitle,
  model,
  isActive,
  subtitle,
  ...props
}: Props) => {
  const name = SHORT_INTEGRATION_NAMES[model.type]
  return (
    <OrbitCard padding={3} borderRadius={100} model={model} chromeless {...props}>
      <Centered>
        <OrbitIcon icon={model.type} size={20} />
        {!hideTitle && (
          <>
            <div style={{ height: 2 }} />
            <SyncStatus settingId={model.id}>
              {(syncJobs, removeJobs) => {
                return (
                  <Text size={0.85} alpha={0.6} ellipse>
                    {syncJobs.length ? 'Syncing...' : removeJobs.length ? 'Removing...' : name}
                  </Text>
                )
              }}
            </SyncStatus>
          </>
        )}
      </Centered>
    </OrbitCard>
  )
}
