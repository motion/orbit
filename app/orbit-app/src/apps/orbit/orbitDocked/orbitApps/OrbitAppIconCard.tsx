import * as React from 'react'
import { OrbitCard } from '../../../../views/OrbitCard'
import { AppInfoStore, AppInfoProps } from '../../../../stores/AppInfoStore'
import { OrbitItemProps } from '../../../../views/OrbitItemProps'
import { SyncStatus } from '../views/SyncStatus'
import { Text } from '@mcro/ui'
import { Setting } from '@mcro/models'
import { NICE_INTEGRATION_NAMES } from '../../../../constants'
import { OrbitIcon } from '../../../../views/OrbitIcon'
import { view } from '@mcro/black'

type Props = OrbitItemProps<Setting> &
  AppInfoProps & {
    store: AppInfoStore
    isActive?: boolean
  }

const Centered = view({
  flex: 1,
  alignItems: 'center',
  justifyContent: 'center',
  padding: [2, 0, 0],
})

export const OrbitAppIconCard = ({ store, model, isActive, subtitle, ...props }: Props) => {
  const name = NICE_INTEGRATION_NAMES[model.type]
  return (
    <OrbitCard model={model} chromeless {...props}>
      <Centered>
        <OrbitIcon icon={model.type} size={28} />
        <div style={{ height: 7 }} />
        <SyncStatus settingId={model.id}>
          {jobs => {
            return (
              <Text size={0.85} alpha={0.6} ellipse>
                {jobs ? 'Syncing...' : name}
              </Text>
            )
          }}
        </SyncStatus>
      </Centered>
    </OrbitCard>
  )
}
